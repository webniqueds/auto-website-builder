import { callNim } from './nim.js';
import { callGroq } from './groq.js';
import { callOpenRouter } from './openrouter.js';

export interface LlmCall {
  name: string;
  run: (signal: AbortSignal) => Promise<string>;
  /** Optional per-provider budget (ms). Falls back to MAX_CALL_MS. */
  maxMs?: number;
}

export interface LlmResult {
  source: string;
  content: string;
}

/**
 * Hard ceiling for the whole generation. Still keeps headroom so the request
 * always finishes with a clear result instead of hanging forever.
 */
const WALL_CLOCK_MS = 115_000;

/** Default per-provider budget for sequential fallback. */
const MAX_CALL_MS = 25_000;

/**
 * NIM can take ~60s on a cold start; give it room without letting it block
 * the whole pipeline. In the parallel race it can still be cancelled early
 * if Groq wins.
 */
const NIM_BUDGET_MS = 90_000;
const GROQ_BUDGET_MS = 20_000;
const OPENROUTER_BUDGET_MS = 60_000;

// ---------------------------------------------------------------------------
// Sequential fallback — tries providers in order until one succeeds.
// ---------------------------------------------------------------------------

/**
 * Runs a list of provider calls in order, returning the first success.
 * Each call is aborted when its share of the budget runs out.
 */
export async function runWithFallback(calls: LlmCall[]): Promise<LlmResult> {
  const start = Date.now();
  const lastErrors: string[] = [];
  let timedOut = false;

  for (const call of calls) {
    const elapsed = Date.now() - start;
    const remaining = WALL_CLOCK_MS - elapsed;
    if (remaining <= 0) break;

    const budget = Math.min(remaining, call.maxMs ?? MAX_CALL_MS);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), budget);

    try {
      const content = await call.run(controller.signal);
      clearTimeout(timer);
      console.log(`[llm] "${call.name}" succeeded`);
      return { source: call.name, content };
    } catch (err) {
      clearTimeout(timer);
      const reason = (err as Error).message || String(err);
      timedOut = timedOut || controller.signal.aborted;
      lastErrors.push(`[${call.name}] ${reason}`);
      console.warn(`[llm] "${call.name}" failed: ${reason}`);
    }
  }

  const timeoutNote = timedOut
    ? ' The AI providers were too slow and the request timed out. Please try again.'
    : '';
  throw new Error(`All AI providers failed.${timeoutNote} ${lastErrors.join(' | ')}`);
}

// ---------------------------------------------------------------------------
// Parallel race — fires all calls at once, takes the first to succeed.
// ---------------------------------------------------------------------------

/**
 * Starts all provider calls simultaneously and resolves with the first
 * successful response. All losers are immediately aborted to free resources.
 *
 * This is the fastest strategy when providers have unpredictable latency:
 * e.g. racing Groq (~5s) vs NIM (~60s) means users typically get the
 * Groq result, but NIM acts as an automatic safety net if Groq is slow or
 * rate-limited — no extra wait time either way.
 */
export async function raceWithFallback(calls: LlmCall[]): Promise<LlmResult> {
  const controllers = calls.map(() => new AbortController());
  const timers: ReturnType<typeof setTimeout>[] = [];

  const promises = calls.map((call, i) => {
    const budget = call.maxMs ?? MAX_CALL_MS;
    timers[i] = setTimeout(() => controllers[i].abort(), budget);

    return call
      .run(controllers[i].signal)
      .then((content): LlmResult => {
        clearTimeout(timers[i]);
        return { source: call.name, content };
      })
      .catch((err: Error) => {
        clearTimeout(timers[i]);
        throw err;
      });
  });

  try {
    // Promise.any resolves with the first fulfilled promise.
    const winner = await Promise.any(promises);
    // Cancel every call that is still running.
    controllers.forEach((c) => c.abort());
    timers.forEach(clearTimeout);
    console.log(`[llm] race won by "${winner.source}"`);
    return winner;
  } catch (aggErr) {
    const errors = calls.map(
      (c, i) => `[${c.name}] ${((aggErr as AggregateError).errors[i] as Error)?.message ?? 'unknown'}`
    );
    throw new Error(`All providers failed in race. ${errors.join(' | ')}`);
  }
}

// ---------------------------------------------------------------------------
// Composed strategies
// ---------------------------------------------------------------------------

/**
 * Content-generation request.
 *
 * Strategy:
 * 1. Race Groq (fast, ~5-10s), NIM (reliable but slow, ~60s) and OpenRouter
 *    (model-cascaded) simultaneously. First valid response wins; the losers
 *    are immediately aborted.
 * 2. If all race participants fail → run the OpenRouter cascade sequentially
 *    as a final resort.
 *
 * Why OpenRouter is in the race: its free models are shared-pool rate-limited,
 * so a single model can 429 randomly — the cascade inside `callOpenRouter`
 * retries the next free model, making it a dependable safety net that answers
 * quickly rather than only as a slow last resort.
 */
export async function callContentAI(
  systemPrompt: string,
  userMessage: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    priority?: boolean;
    onToken?: (delta: string) => void;
  }
): Promise<LlmResult> {
  try {
    // Priority (paid) plans: skip the dead/slow Groq leg and race the two
    // reliable providers directly — whoever answers first wins. NIM keeps its
    // long cold-start budget; OpenRouter gets a fair chance at a fast answer.
    if (options?.priority) {
      try {
        return await raceWithFallback([
          {
            name: 'nim',
            maxMs: NIM_BUDGET_MS,
            run: (signal) =>
              callNim(systemPrompt, userMessage, {
                temperature: options?.temperature,
                maxTokens: options?.maxTokens,
                signal,
              }),
          },
          {
            name: 'openrouter',
            maxMs: OPENROUTER_BUDGET_MS,
            run: (signal) =>
              callOpenRouter(systemPrompt, userMessage, {
                temperature: options?.temperature,
                maxTokens: options?.maxTokens,
                signal,
                onToken: options?.onToken,
              }),
          },
        ]);
      } catch (raceErr) {
        console.warn('[llm] priority race failed, falling back:', (raceErr as Error).message);
        return runWithFallback([
          {
            name: 'nim',
            maxMs: NIM_BUDGET_MS,
            run: (signal) =>
              callNim(systemPrompt, userMessage, {
                temperature: options?.temperature,
                maxTokens: options?.maxTokens,
                signal,
              }),
          },
          {
            name: 'openrouter',
            maxMs: OPENROUTER_BUDGET_MS,
            run: (signal) =>
              callOpenRouter(systemPrompt, userMessage, {
                temperature: options?.temperature,
                maxTokens: options?.maxTokens,
                signal,
                onToken: options?.onToken,
              }),
          },
        ]);
      }
    }

    return await raceWithFallback([
      {
        name: 'groq',
        maxMs: GROQ_BUDGET_MS,
        run: (signal) =>
          callGroq(systemPrompt, userMessage, {
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
            signal,
          }),
      },
      {
        name: 'nim',
        maxMs: NIM_BUDGET_MS,
        run: (signal) =>
          callNim(systemPrompt, userMessage, {
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
            signal,
          }),
      },
      {
        name: 'openrouter',
        maxMs: OPENROUTER_BUDGET_MS,
        run: (signal) =>
          callOpenRouter(systemPrompt, userMessage, {
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
            signal,
            onToken: options?.onToken,
          }),
      },
    ]);
  } catch (raceErr) {
    // All three failed → try providers sequentially as a final last resort.
    console.warn('[llm] Groq+NIM+OpenRouter race failed, trying sequential fallback:', (raceErr as Error).message);
    return runWithFallback([
      {
        name: 'openrouter',
        maxMs: OPENROUTER_BUDGET_MS,
        run: (signal) =>
          callOpenRouter(systemPrompt, userMessage, {
            temperature: options?.temperature,
            maxTokens: options?.maxTokens,
            signal,
            onToken: options?.onToken,
          }),
      },
    ]);
  }
}

/**
 * Image-query request — same race strategy but without OpenRouter fallback
 * (image queries are short and NIM handles them reliably).
 */
export async function callImageAI(
  systemPrompt: string,
  userMessage: string,
  options?: { temperature?: number; maxTokens?: number }
): Promise<LlmResult> {
  return runWithFallback([
    { name: 'nim', maxMs: NIM_BUDGET_MS, run: (signal) => callNim(systemPrompt, userMessage, { ...options, signal }) },
    { name: 'openrouter', maxMs: OPENROUTER_BUDGET_MS, run: (signal) => callOpenRouter(systemPrompt, userMessage, { ...options, signal }) },
  ]);
}