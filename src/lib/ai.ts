import { GenerateRequest, EditRequest, SiteConfig } from '../types';

export type AgentStatus = 'idle' | 'running' | 'complete' | 'error';

export interface AgentProgress {
  agent: string;
  status: AgentStatus;
  message: string;
}

async function postJSON<T>(url: string, body: unknown): Promise<T> {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let message = `Server error: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // ignore parse failure, keep status-based message
    }
    throw new Error(message);
  }

  return (await res.json()) as T;
}

const PIPELINE_AGENTS = ['analysis', 'content', 'images', 'assembly'];

function emitProgress(
  onProgress: (progress: AgentProgress) => void,
  agent: string,
  status: AgentStatus,
  message: string
) {
  onProgress({ agent, status, message });
}

function mapStepToAgent(step: string | undefined): string {
  switch (step) {
    case 'connect':
    case 'writing':
      return 'content';
    case 'images':
      return 'images';
    case 'assembly':
      return 'assembly';
    default:
      return 'analysis';
  }
}

export async function generateSiteV2(
  request: GenerateRequest,
  onProgress: (progress: AgentProgress) => void
): Promise<SiteConfig> {
  const res = await fetch('/api/generate-site-v2', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    let message = `Server error: ${res.status}`;
    try {
      const data = (await res.json()) as { error?: string };
      if (data?.error) message = data.error;
    } catch {
      // keep status-based message
    }
    throw new Error(message);
  }

  const markAllComplete = () => {
    for (const agent of PIPELINE_AGENTS) {
      emitProgress(onProgress, agent, 'complete', '');
    }
  };

  // Non-streaming fallback (some environments buffer the whole body):
  if (!res.body) {
    const data = (await res.json()) as SiteConfig | { error?: string };
    if ((data as { error?: string }).error) throw new Error((data as { error: string }).error);
    markAllComplete();
    return data as SiteConfig;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result: SiteConfig | null = null;
  let serverError: string | null = null;

  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      const blocks = buffer.split('\n\n');
      buffer = blocks.pop() ?? '';

      for (const block of blocks) {
        for (const line of block.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed.startsWith('data:')) continue;
          const raw = trimmed.slice(5).trim();
          if (!raw) continue;

          let event: { type?: string; step?: string; message?: string; config?: SiteConfig };
          try {
            event = JSON.parse(raw);
          } catch {
            continue;
          }

          if (event.type === 'step' || event.type === 'progress') {
            emitProgress(onProgress, mapStepToAgent(event.step), 'running', event.message || '');
          } else if (event.type === 'result' && event.config) {
            result = event.config;
          } else if (event.type === 'error' && event.message) {
            serverError = event.message;
          }
        }
      }
    }
  } finally {
    reader.releaseLock();
  }

  if (serverError) throw new Error(serverError);
  if (!result) throw new Error('The server closed the connection before the site was ready. Please try again.');

  markAllComplete();
  return result;
}

export async function generateSite(request: GenerateRequest): Promise<SiteConfig> {
  return postJSON<SiteConfig>('/api/generate-site', request);
}

export async function editSite(request: EditRequest): Promise<SiteConfig> {
  return postJSON<SiteConfig>('/api/edit-site', request);
}