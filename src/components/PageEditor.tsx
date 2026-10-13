import { useMemo, useRef, useState } from 'react';
import {
  Type,
  Image as ImageIcon,
  RefreshCw,
  Trash2,
  UploadCloud,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import type { SiteConfig } from '../types';
import {
  buildFieldEntries,
  buildImageFields,
  groupLabel,
  setPathValue,
  resizeImageForStorage,
} from '../lib/editConfig';
import { cn } from '../lib/utils';

interface PageEditorProps {
  config: SiteConfig;
  onChange: (config: SiteConfig) => void;
}

const TEXTAREA_PATTERNS = /description|subtitle|details|bio|paragraph|quote|story|summary|text/i;

function groupEntries(entries: ReturnType<typeof buildFieldEntries>) {
  const map = new Map<string, typeof entries>();
  for (const entry of entries) {
    const g = groupLabel(entry);
    if (!map.has(g)) map.set(g, []);
    map.get(g)!.push(entry);
  }
  return [...map.entries()];
}

export default function PageEditor({ config, onChange }: PageEditorProps) {
  const [tab, setTab] = useState<'text' | 'images'>('text');
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set());
  const fileRefs = useRef<Record<string, HTMLInputElement | null>>({});
  const [imageError, setImageError] = useState('');

  const entries = useMemo(() => buildFieldEntries(config), [config]);
  const groups = useMemo(() => groupEntries(entries), [entries]);
  const images = useMemo(() => buildImageFields(config), [config]);

  function update(path: string, value: string) {
    onChange(setPathValue(config, path, value));
  }

  async function handleImageReplace(key: string, file: File | null) {
    setImageError('');
    if (!file) return;
    try {
      const dataUrl = await resizeImageForStorage(file);
      const next: SiteConfig = {
        ...config,
        imagePrompts: { ...(config.imagePrompts ?? {}), [key]: dataUrl },
      };
      onChange(next);
    } catch (err) {
      setImageError(err instanceof Error ? err.message : 'Failed to upload image.');
    }
  }

  function handleImageReset(key: string) {
    const prompts = { ...(config.imagePrompts ?? {}) };
    delete prompts[key];
    onChange({ ...config, imagePrompts: prompts });
  }

  function toggleGroup(g: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(g)) next.delete(g);
      else next.add(g);
      return next;
    });
  }

  return (
    <div className="flex h-full w-full flex-col overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3">
        <div className="text-sm font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Customize
        </div>
        <div className="flex gap-1 rounded-full bg-[var(--app-surface-hover)] p-1">
          <button
            onClick={() => setTab('text')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors',
              tab === 'text' ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'text-[var(--app-muted)]'
            )}
          >
            <Type size={12} />
            Text
          </button>
          <button
            onClick={() => setTab('images')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-medium transition-colors',
              tab === 'images' ? 'bg-[var(--app-fg)] text-[var(--app-bg)]' : 'text-[var(--app-muted)]'
            )}
          >
            <ImageIcon size={12} />
            Images
          </button>
        </div>
      </div>

      {/* Body */}
      {tab === 'text' ? (
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {groups.map(([group, fields]) => {
            const open = openGroups.has(group) || fields.length <= 3;
            return (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left text-[13px] font-semibold text-[var(--app-fg)] transition-colors hover:bg-[var(--app-surface-hover)]"
                >
                  <span>{group}</span>
                  <span className="text-[11px] font-normal text-[var(--app-muted)]">
                    {fields.length} {fields.length === 1 ? 'field' : 'fields'}
                  </span>
                </button>
                <div className="mt-1 space-y-2">
                  {open
                    ? fields.map((f) => (
                        <label key={f.path} className="block">
                          <span className="mb-1 block text-[11px] font-medium text-[var(--app-muted)]">
                            {f.label}
                          </span>
                          {TEXTAREA_PATTERNS.test(f.label) || f.value.length > 80 ? (
                            <textarea
                              value={f.value}
                              onChange={(e) => update(f.path, e.target.value)}
                              rows={Math.min(5, Math.max(2, Math.ceil(f.value.length / 60)))}
                              className="w-full resize-y rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-[13px] leading-relaxed text-[var(--app-fg)] outline-none transition-colors focus:border-[var(--app-fg)]"
                            />
                          ) : (
                            <input
                              type="text"
                              value={f.value}
                              onChange={(e) => update(f.path, e.target.value)}
                              className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-[13px] text-[var(--app-fg)] outline-none transition-colors focus:border-[var(--app-fg)]"
                            />
                          )}
                        </label>
                      ))
                    : fields.slice(0, 2).map((f) =>
                        f.value ? (
                          <p key={f.path} className="truncate text-[12px] text-[var(--app-muted)]">
                            {f.label}: {f.value}
                          </p>
                        ) : null
                      )}
                  {!open && fields.length > 2 && (
                    <button
                      onClick={() => toggleGroup(group)}
                      className="flex items-center gap-1 text-[11px] font-medium text-[var(--app-muted)] hover:text-[var(--app-fg)]"
                    >
                      <ChevronDown size={12} />
                      Show {fields.length - 2} more
                    </button>
                  )}
                  {open && fields.length > 3 && (
                    <button
                      onClick={() => toggleGroup(group)}
                      className="flex items-center gap-1 text-[11px] font-medium text-[var(--app-muted)] hover:text-[var(--app-fg)]"
                    >
                      <ChevronRight size={12} />
                      Collapse
                    </button>
                  )}
                </div>
              </div>
            );
          })}
          {entries.length === 0 && (
            <p className="text-center text-xs text-[var(--app-muted)]">No editable text fields found.</p>
          )}
        </div>
      ) : (
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {images.map((img) => (
            <div
              key={img.key}
              className="flex items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-3"
            >
              <div
                className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--app-border)] bg-[var(--app-surface-hover)]"
              >
                {img.hasValue ? (
                  <img src={img.value} alt={img.label} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon size={18} className="text-[var(--app-muted)]" strokeWidth={1.5} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold">{img.label}</div>
                <div className="mt-0.5 text-[11px] text-[var(--app-muted)]">
                  {img.hasValue ? 'Custom image' : 'Template default'}
                </div>
                <div className="mt-2 flex items-center gap-2">
                  <input
                    ref={(el) => {
                      fileRefs.current[img.key] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      handleImageReplace(img.key, e.target.files?.[0] ?? null);
                      e.target.value = '';
                    }}
                  />
                  <button
                    onClick={() => fileRefs.current[img.key]?.click()}
                    className="flex items-center gap-1.5 rounded-full bg-[var(--app-fg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--app-bg)] transition-transform hover:scale-[1.03]"
                  >
                    <UploadCloud size={12} />
                    {img.hasValue ? 'Replace' : 'Upload'}
                  </button>
                  {img.hasValue && (
                    <button
                      onClick={() => handleImageReset(img.key)}
                      className="flex items-center gap-1.5 rounded-full border border-[var(--app-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)]"
                    >
                      <RefreshCw size={11} />
                      Reset
                    </button>
                  )}
                </div>
              </div>
              {img.value.startsWith('data:') && (
                <button
                  onClick={() => handleImageReset(img.key)}
                  className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
                  title="Remove uploaded image"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          ))}
          {images.length === 0 && (
            <p className="text-center text-xs text-[var(--app-muted)]">No images found in this site.</p>
          )}
          {imageError && <p className="text-center text-xs font-medium text-red-500">{imageError}</p>}
        </div>
      )}

      <div className="border-t border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-2.5">
        <p className="text-center text-[11px] text-[var(--app-muted)]">
          Changes save automatically to this device.
        </p>
      </div>
    </div>
  );
}