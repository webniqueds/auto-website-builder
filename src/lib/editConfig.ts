import type { SiteConfig } from '../types';

export interface FieldEntry {
  path: string;
  label: string;
  value: string;
}

export interface ImageField {
  key: string;
  label: string;
  value: string;
  hasValue: boolean;
}

const SKIP_KEYS = new Set(['id', 'icon', 'mediaType', 'image', 'imageKey']);

const IMAGE_LIST_SECTIONS = new Set([
  'gallery',
  'listings',
  'team',
  'attorneys',
  'barbers',
  'realWeddings',
  'weddings',
  'arrangements',
  'work',
  'projects',
  'neighborhoods',
  'features',
  'reviews',
  'menu',
]);

export function titleCase(s: string): string {
  return s
    .replace(/[_-]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v);
}

function appendEntries(
  value: unknown,
  path: string,
  label: string,
  out: FieldEntry[]
): void {
  if (typeof value === 'string') {
    out.push({ path, label, value });
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => {
      appendEntries(item, `${path}[${i}]`, `${label} ${i + 1}`, out);
    });
    return;
  }
  if (isPlainObject(value)) {
    for (const [k, v] of Object.entries(value)) {
      if (SKIP_KEYS.has(k)) continue;
      appendEntries(v, path ? `${path}.${k}` : k, path ? `${label} · ${titleCase(k)}` : titleCase(k), out);
    }
  }
}

export function buildFieldEntries(config: SiteConfig): FieldEntry[] {
  const out: FieldEntry[] = [];

  const siteFields: Array<[string, string]> = [
    ['brandName', 'Brand name'],
    ['tagline', 'Tagline'],
    ['description', 'Description'],
    ['ctaPrimary', 'Primary button'],
    ['ctaSecondary', 'Secondary button'],
    ['niche', 'Niche'],
  ];
  for (const [k, label] of siteFields) {
    const v = (config as unknown as Record<string, unknown>)[k];
    if (typeof v === 'string') out.push({ path: k, label, value: v });
  }

  for (const [sectionKey, sectionValue] of Object.entries(config.sections)) {
    appendEntries(sectionValue, `sections.${sectionKey}`, titleCase(sectionKey), out);
  }

  return out;
}

export function groupLabel(entry: FieldEntry): string {
  const segs = entry.path.split('.');
  if (segs[0] === 'sections') {
    return titleCase(segs[1] ?? '');
  }
  return 'Site';
}

export function getPathValue(obj: unknown, path: string): unknown {
  const segs = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let cur: unknown = obj;
  for (const s of segs) {
    if (cur == null) return undefined;
    cur = (cur as Record<string, unknown>)[s];
  }
  return cur;
}

export function setPathValue<T>(obj: T, path: string, value: unknown): T {
  const segs = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  const clone = JSON.parse(JSON.stringify(obj)) as Record<string, unknown>;
  let cur: Record<string, unknown> = clone;
  for (let i = 0; i < segs.length - 1; i++) {
    const seg = segs[i];
    const next = cur[seg];
    if (next == null || typeof next !== 'object') {
      const created = /^\d+$/.test(segs[i + 1]) ? [] : {};
      cur[seg] = created;
    }
    cur = cur[seg] as Record<string, unknown>;
  }
  cur[segs[segs.length - 1]] = value;
  return clone as T;
}

export function buildImageFields(config: SiteConfig): ImageField[] {
  const seen = new Set<string>();
  const out: ImageField[] = [];

  const add = (key: string, label: string) => {
    if (seen.has(key)) return;
    seen.add(key);
    const value = config.imagePrompts?.[key] ?? '';
    out.push({ key, label, value, hasValue: Boolean(value) });
  };

  if (config.sections?.['hero']) {
    add('hero', 'Hero image');
  }

  for (const [sectionKey, sectionValue] of Object.entries(config.sections ?? {})) {
    if (!isPlainObject(sectionValue)) continue;
    for (const [_k, v] of Object.entries(sectionValue)) {
      if (Array.isArray(v) && v.length > 0 && IMAGE_LIST_SECTIONS.has(sectionKey)) {
        v.forEach((_, i) => add(`${sectionKey}-${i}`, `${titleCase(sectionKey)} ${i + 1}`));
      }
    }
    if (typeof sectionValue['image'] === 'string') {
      add(sectionKey, `${titleCase(sectionKey)} image`);
    }
  }

  for (const key of Object.keys(config.imagePrompts ?? {})) {
    add(key, titleCase(key.replace(/-\d+$/, '')));
  }

  return out;
}

const MAX_IMAGE_EDGE = 1600;
const IMAGE_QUALITY = 0.82;

export function resizeImageForStorage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read the image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('The selected file is not a valid image.'));
      img.onload = () => {
        const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(img.width, img.height));
        const w = Math.round(img.width * scale);
        const h = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas is not available in this browser.'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);
        try {
          resolve(canvas.toDataURL('image/jpeg', IMAGE_QUALITY));
        } catch {
          reject(new Error('Could not encode the image.'));
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}