import type { SiteConfig } from '../types';

type LeafValue = { value: string; path: string };

/**
 * Collects every user-visible text string in the config (skips theme tokens
 * and imagePrompts) so a clicked text node can be mapped back to its config
 * path by matching the text value.
 */
export function collectTextValues(config: SiteConfig): LeafValue[] {
  const out: LeafValue[] = [];
  const walk = (obj: unknown, path: string): void => {
    if (typeof obj === 'string') {
      const t = obj.trim();
      if (t.length > 0 && t.length <= 200) out.push({ value: t, path });
      return;
    }
    if (Array.isArray(obj)) {
      obj.forEach((item, i) => walk(item, `${path}.${i}`));
      return;
    }
    if (obj !== null && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        walk(v, path ? `${path}.${k}` : k);
      }
    }
  };

  for (const [k, v] of Object.entries(config)) {
    if (k === 'theme' || k === 'imagePrompts' || k === 'palette') continue;
    walk(v, k);
  }
  return out;
}

/**
 * Returns a map of text → config paths, preferring the shortest path when the
 * same string appears many times (e.g. a name shown in the footer too).
 */
export function buildTextIndex(config: SiteConfig): Map<string, string> {
  const index = new Map<string, string>();
  for (const { value, path } of collectTextValues(config)) {
    const existing = index.get(value);
    if (!existing || path.length < existing.length) index.set(value, path);
  }
  return index;
}

/** Looks up the config path for a rendered text snippet. */
export function findTextPath(index: Map<string, string>, text: string): string | null {
  const t = text.trim();
  if (!t) return null;
  if (t.length <= 200 && index.has(t)) return index.get(t)!;
  return null;
}

/**
 * Finds the imagePrompts key whose value matches the given src (exact or
 * protocol-normalized, i.e. currentSrc vs src). Returns null when the image
 * came from a renderer fallback rather than the config.
 */
export function findImageKey(config: SiteConfig, src: string): string | null {
  const pool = config.imagePrompts ?? {};
  const norm = (s: string): string => s.replace(/^https:\/\//, 'http://').split('?')[0];
  const target = norm(src);
  for (const [key, value] of Object.entries(pool)) {
    if (!value) continue;
    if (value === src) return key;
    if (norm(value) === target) return key;
  }
  return null;
}