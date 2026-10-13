import type { VercelRequest, VercelResponse } from '@vercel/node';
import { callGroq, parseJsonResponse } from './_lib/groq.js';
import { callNim } from './_lib/nim.js';
import { callOpenRouter } from './_lib/openrouter.js';
import { raceWithFallback } from './_lib/llm.js';

const EDIT_SYSTEM_PROMPT = `You are a senior web designer editing an existing website configuration.

You will receive:
- CURRENT CONFIG: the current full JSON configuration of the website (images stripped for brevity)
- CHANGE REQUEST: what the user wants to change

Return a JSON object containing ONLY the fields that need to change.

RULES:
1. The result is deep-merged onto the current config, so include ONLY what changes. Do not echo back unchanged values.
2. Never remove or rename sections. You may edit text fields inside any section (titles, subtitles, descriptions, item titles, quotes, etc.).
3. Top-level fields you may change: brandName, tagline, description, ctaPrimary, ctaSecondary.
4. To change colors, edit the theme object (background, foreground, accent, muted) using hex colors like "#1A1A1A".
5. Keep IDs intact. Do not add new array items unless the change explicitly asks for more items.
6. Return ONLY valid JSON. No markdown fences, no explanation.`;

/** Fields that are always image URLs — stripping them shrinks the prompt by ~40%. */
const IMAGE_KEYS = new Set(['image', 'src', 'url', 'photo', 'backgroundImage', 'logo', 'imagePrompts']);

/**
 * Recursively removes image URL fields from the config before sending it to
 * the AI. The AI never modifies images (per the system prompt), so including
 * them just wastes tokens and slows the response.
 */
function stripImages(obj: unknown): unknown {
  if (Array.isArray(obj)) return obj.map(stripImages);
  if (obj && typeof obj === 'object') {
    const result: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      if (IMAGE_KEYS.has(k)) continue;
      result[k] = stripImages(v);
    }
    return result;
  }
  return obj;
}

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const srcVal = source[key];
    const tgtVal = result[key];
    if (
      srcVal && typeof srcVal === 'object' && !Array.isArray(srcVal) &&
      tgtVal && typeof tgtVal === 'object' && !Array.isArray(tgtVal)
    ) {
      result[key] = deepMerge(tgtVal as Record<string, unknown>, srcVal as Record<string, unknown>);
    } else {
      result[key] = srcVal;
    }
  }
  return result;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { currentConfig, change } = req.body;
    if (!currentConfig || typeof currentConfig !== 'object' || typeof change !== 'string' || change.trim() === '') {
      return res.status(400).json({ error: 'Missing currentConfig or change' });
    }

    // Strip image fields before sending — reduces prompt size by ~40% and
    // avoids confusing the model with long Unsplash URLs it should never touch.
    const strippedConfig = stripImages(currentConfig);

    const userMessage = `CURRENT CONFIG:
${JSON.stringify(strippedConfig, null, 2)}

CHANGE REQUEST:
${change}

Return only the fields that need to change.`;

    // Race Groq (fast) vs NIM (reliable), same strategy as site generation.
    let source: string;
    let content: string;
    try {
      const result = await raceWithFallback([
        { name: 'groq', maxMs: 15_000, run: (signal) => callGroq(EDIT_SYSTEM_PROMPT, userMessage, { temperature: 0.5, maxTokens: 1024, signal }) },
        { name: 'nim',  maxMs: 60_000, run: (signal) => callNim(EDIT_SYSTEM_PROMPT,  userMessage, { temperature: 0.5, maxTokens: 1024, signal }) },
      ]);
      source = result.source;
      content = result.content;
    } catch {
      // Both fast providers failed → OpenRouter as final resort.
      console.warn('[edit] Groq+NIM race failed, falling back to OpenRouter');
      const fallback = await callOpenRouter(EDIT_SYSTEM_PROMPT, userMessage, { temperature: 0.5, maxTokens: 1024 });
      source = 'openrouter';
      content = fallback;
    }

    console.log(`[edit] Applied via "${source}"`);

    let parsed: Record<string, unknown>;
    try {
      parsed = parseJsonResponse(content);
    } catch {
      return res.status(500).json({ error: 'AI returned an unparseable response. Please try again.' });
    }

    const merged = deepMerge(currentConfig as Record<string, unknown>, parsed);
    return res.status(200).json(merged);
  } catch (err) {
    console.error('[edit] Fatal error:', err);
    return res.status(500).json({ error: 'Edit failed. Please check your API keys and try again.' });
  }
}