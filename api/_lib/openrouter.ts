const OPENROUTER_BASE_URL = 'https://openrouter.ai/api/v1';

export const OPENROUTER_DEFAULT_MODEL =
  process.env.OPENROUTER_MODEL || 'poolside/laguna-s-2.1:free';

// Free-tier models share upstream rate-limit pools and frequently 429 under
// load, so we cascade through several when the preferred model is throttled.
// Verified responsive at the time of writing; re-check periodically.
const OPENROUTER_FALLBACK_MODELS = [
  'nvidia/nemotron-3-ultra-550b-a55b:free',
  'cohere/north-mini-code:free',
  'dots-studio/dots-3-note-preview:free',
  'google/gemma-4-26b-a4b-it:free',
  'z-ai/glm-5.2:free',
];

function modelCandidates(configuredModel: string): string[] {
  return [
    configuredModel,
    ...OPENROUTER_FALLBACK_MODELS.filter((m) => m !== configuredModel),
  ].slice(0, 4);
}

interface CallOptions {
  temperature?: number;
  maxTokens?: number;
  model?: string;
  signal?: AbortSignal;
  onToken?: (delta: string) => void;
}

interface ChatBody {
  model: string;
  messages: { role: string; content: string }[];
  temperature: number;
  max_tokens: number;
  stream?: boolean;
}

function buildBody(systemPrompt: string, userMessage: string, options?: CallOptions, stream = false): ChatBody {
  return {
    model: (options?.model || process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL),
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage },
    ],
    temperature: options?.temperature ?? 0.7,
    max_tokens: options?.maxTokens ?? 4096,
    stream,
  };
}

function buildHeaders(apiKey: string): Record<string, string> {
  const referer = process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : process.env.OPENROUTER_REFERER || 'http://localhost:3001';
  return {
    Authorization: `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'HTTP-Referer': referer,
    'X-Title': 'AI Website Builder',
  };
}

// Stall guard: if no token arrives within this window, the stream is assumed
// stuck (some models advertise streaming but never emit) and we retry without
// streaming instead of hanging the whole generation.
const FIRST_TOKEN_TIMEOUT_MS = 20_000;
const IDLE_TIMEOUT_MS = 12_000;
const NON_STREAM_TIMEOUT_MS = 35_000;

async function nonStreamOnce(
  apiKey: string,
  body: ChatBody,
  options: CallOptions | undefined
): Promise<string> {
  const local = new AbortController();
  const onOuterAbort = () => local.abort();
  options?.signal?.addEventListener('abort', onOuterAbort, { once: true });
  const timer = setTimeout(() => local.abort(), NON_STREAM_TIMEOUT_MS);
  const signal = local.signal;

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      signal,
      headers: buildHeaders(apiKey),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0].message.content;
  } finally {
    clearTimeout(timer);
    options?.signal?.removeEventListener('abort', onOuterAbort);
  }
}

async function streamOnce(
  apiKey: string,
  body: ChatBody,
  options: CallOptions | undefined
): Promise<string> {
  // Local controller so we can abort a stalled stream without touching the
  // caller's signal (which would prevent the non-streaming retry).
  const local = new AbortController();
  const onOuterAbort = () => local.abort();
  options?.signal?.addEventListener('abort', onOuterAbort, { once: true });
  const signal = local.signal;

  let firstTokenTimer: ReturnType<typeof setTimeout> | null = null;
  let idleTimer: ReturnType<typeof setTimeout> | null = null;

  const clearTimers = () => {
    if (firstTokenTimer) clearTimeout(firstTokenTimer);
    if (idleTimer) clearTimeout(idleTimer);
    firstTokenTimer = null;
    idleTimer = null;
  };

  try {
    const response = await fetch(`${OPENROUTER_BASE_URL}/chat/completions`, {
      method: 'POST',
      signal,
      headers: buildHeaders(apiKey),
      body: JSON.stringify({ ...body, stream: true }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => '');
      throw new Error(`OpenRouter API error ${response.status}: ${errText}`);
    }
    if (!response.body) throw new Error('OpenRouter stream: no response body');

    const armIdleTimer = () => {
      if (idleTimer) clearTimeout(idleTimer);
      idleTimer = setTimeout(() => local.abort(), IDLE_TIMEOUT_MS);
    };

    firstTokenTimer = setTimeout(() => local.abort(), FIRST_TOKEN_TIMEOUT_MS);

    let content = '';
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';

    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const lines = buffer.split('\n');
      buffer = lines.pop() ?? '';

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed.startsWith('data:')) continue;
        const payload = trimmed.slice(5).trim();
        if (!payload || payload === '[DONE]') continue;
        try {
          const chunk = JSON.parse(payload) as {
            choices?: { delta?: { content?: string } }[];
          };
          const delta = chunk.choices?.[0]?.delta?.content;
          if (typeof delta === 'string' && delta.length > 0) {
            if (firstTokenTimer) {
              clearTimeout(firstTokenTimer);
              firstTokenTimer = null;
            }
            content += delta;
            options!.onToken!(delta);
            armIdleTimer();
          }
        } catch {
          // ignore partial/keepalive frames
        }
      }
    }

    clearTimers();
    if (content.length === 0) throw new Error('OpenRouter stream ended with no content');
    return content;
  } finally {
    clearTimers();
    options?.signal?.removeEventListener('abort', onOuterAbort);
  }
}

export async function callOpenRouter(
  systemPrompt: string,
  userMessage: string,
  options?: {
    temperature?: number;
    maxTokens?: number;
    model?: string;
    signal?: AbortSignal;
    onToken?: (delta: string) => void;
  }
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY || '';
  if (!apiKey) {
    throw new Error('No OpenRouter API key configured');
  }

  const candidates = modelCandidates(options?.model || process.env.OPENROUTER_MODEL || OPENROUTER_DEFAULT_MODEL);
  const failures: string[] = [];

  for (const model of candidates) {
    const body = buildBody(systemPrompt, userMessage, { ...options, model });

    try {
      if (options?.onToken) {
        try {
          return await streamOnce(apiKey, body, options);
        } catch (err) {
          // Respect the caller's abort (provider-failover budget) — never mask it.
          if (options.signal?.aborted) throw err;
          console.warn(
            `[openrouter] ${model} stream failed/stalled, retrying without streaming:`,
            (err as Error).message.slice(0, 120)
          );
          return nonStreamOnce(apiKey, body, options);
        }
      }
      return await nonStreamOnce(apiKey, body, options);
    } catch (err) {
      if (options?.signal?.aborted) throw err;
      failures.push(`${model} → ${(err as Error).message.slice(0, 120)}`);
      console.warn(`[openrouter] ${model} failed, trying next candidate: ${(err as Error).message.slice(0, 120)}`);
    }
  }

  throw new Error(`OpenRouter all models failed. ${failures.join(' | ')}`);
}