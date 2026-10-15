const GROQ_BASE_URL = 'https://api.groq.com/openai/v1';

// Groq retires hosted models on a rolling basis, so the default is
// overridable via GROQ_MODEL. Verified live: qwen/qwen3.8-27b.
// Earlier defaults that are now retired and return HTTP 404:
//   'llama-3.1-8b-instant', 'gpt-oss-20b'
export const GROQ_MODEL = process.env.GROQ_MODEL || 'qwen/qwen3.8-27b';

export async function callGroq(
  systemPrompt: string,
  userMessage: string,
  options?: { temperature?: number; maxTokens?: number; model?: string; signal?: AbortSignal }
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY || '';
  if (!apiKey) {
    throw new Error('No Groq API key configured');
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: 'POST',
    signal: options?.signal,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options?.model || GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
      temperature: options?.temperature ?? 0.7,
      max_completion_tokens: options?.maxTokens ?? 4096,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => '');
    throw new Error(`Groq API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as {
    choices: { message: { content: string } }[];
  };
  return data.choices[0].message.content;
}

function repairJson(s: string): string {
  let open = 0;
  for (const ch of s) {
    if (ch === '{' || ch === '[') open++;
    if (ch === '}' || ch === ']') open--;
  }
  while (open > 0) {
    const last = s[s.length - 1];
    if (last === ',') {
      s = s.slice(0, -1);
    } else {
      s += last === '{' ? '}' : ']';
    }
    open--;
  }
  return s;
}

export function parseJsonResponse(text: string): Record<string, unknown> {
  let cleaned = text.trim();

  // Strip thinking tags (handle any Unicode variation or prefix)
  const thinkMatch = cleaned.match(/<thinking[\s>][\s\S]*?<\/thinking\s*>/i);
  if (thinkMatch) {
    cleaned = cleaned.slice(thinkMatch.index! + thinkMatch[0].length).trim();
  }

  // Strip markdown fences
  if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }

  // Extract first JSON object
  const firstBrace = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace > firstBrace) {
    cleaned = cleaned.substring(firstBrace, lastBrace + 1);
  }

  try {
    return JSON.parse(cleaned);
  } catch {
    const repaired = repairJson(cleaned);
    return JSON.parse(repaired);
  }
}