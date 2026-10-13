import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Pencil, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProject, updateProject } from '../lib/storage';
import { fetchRemoteProject } from '../lib/serverSync';
import { setPathValue, getPathValue, resizeImageForStorage } from '../lib/editConfig';
import { buildTextIndex, findTextPath, findImageKey } from '../lib/inlineEdit';
import { rendererMap } from '../lib/rendererMap';
import type { Project, SiteConfig } from '../types';

const TEXT_TAGS = 'h1,h2,h3,h4,h5,p,li,dd,dt,figcaption,td,th,span,small,strong,em,blockquote';

export default function PreviewSandbox() {
  const { projectId } = useParams<{ projectId: string }>();

  const [project, setProject] = useState<Project | null>(() =>
    projectId ? getProject(projectId) : null
  );
  const [editingSite, setEditingSite] = useState(false);
  const [editingPath, setEditingPath] = useState<string | null>(null);
  const [imgError, setImgError] = useState('');
  const commitRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageKeyRef = useRef<string | null>(null);
  const editingElRef = useRef<HTMLElement | null>(null);

  const textIndex = useMemo(() => buildTextIndex(project?.config as SiteConfig), [project?.config]);

  useEffect(() => {
    if (projectId && !project) {
      fetchRemoteProject(projectId).then((remote) => {
        if (remote) setProject(remote);
      });
    }
  }, [projectId, project]);

  useEffect(() => {
    return () => window.clearTimeout(commitRef.current);
  }, []);

  const persist = useCallback((config: SiteConfig) => {
    setProject((p) => {
      if (!p) return p;
      const updated = { ...p, config, updatedAt: Date.now() };
      window.clearTimeout(commitRef.current);
      commitRef.current = window.setTimeout(() => {
        updateProject(updated);
      }, 500);
      return updated;
    });
  }, []);

  const commitTextEdit = useCallback(
    (revert: boolean) => {
      const el = editingElRef.current;
      const path = editingPath;
      editingElRef.current = null;
      setEditingPath(null);
      if (!el || !path || !project) return;

      el.contentEditable = 'false';
      el.style.outline = '';
      el.style.outlineOffset = '';

      if (revert) {
        const original = getPathValue(project.config, path);
        el.innerText = String(original ?? '');
        return;
      }

      const original = getPathValue(project.config, path);
      const raw = (el.innerText ?? '').trim();
      let next: unknown;
      if (typeof original === 'number') {
        const n = Number(raw);
        next = Number.isFinite(n) && raw !== '' ? n : original;
      } else {
        next = raw || original;
      }
      if (next !== original) {
        persist(setPathValue(project.config, path, next) as SiteConfig);
      }
    },
    [editingPath, project, persist]
  );

  const startTextEdit = useCallback(
    (el: HTMLElement, path: string) => {
      commitTextEdit(false);
      el.contentEditable = 'true';
      el.style.outline = '2px dashed rgba(0,0,0,0.4)';
      el.style.outlineOffset = '3px';
      editingElRef.current = el;
      setEditingPath(path);
      el.focus();
      const range = document.createRange();
      range.selectNodeContents(el);
      range.collapse(false);
      const sel = window.getSelection();
      sel?.removeAllRanges();
      sel?.addRange(range);
    },
    [commitTextEdit]
  );

  const handleSiteClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!editingSite || !project) return;
      const target = e.target as HTMLElement;
      if (!target || !target.closest) return;

      if (target.tagName === 'IMG' || target.closest('img')) {
        e.preventDefault();
        e.stopPropagation();
        const img = target.closest('img') as HTMLImageElement;
        const src = img.getAttribute('src') || img.currentSrc || '';
        const key = findImageKey(project.config, src);
        if (key === null) {
          setImgError('This image is a template default. It can be changed from a template image field.');
          window.setTimeout(() => setImgError(''), 3000);
          return;
        }
        imageKeyRef.current = key;
        fileInputRef.current?.click();
        return;
      }

      if (target.closest('a, button, input, textarea, select, [contenteditable="true"]')) return;

      const el = target.closest(TEXT_TAGS) as HTMLElement | null;
      if (!el) return;
      const text = el.textContent?.trim();
      if (!text) return;
      const path = findTextPath(textIndex, text);
      if (!path) return;

      e.preventDefault();
      startTextEdit(el, path);
    },
    [editingSite, project, textIndex, startTextEdit]
  );

  const handleSiteFocusOut = useCallback(
    (e: React.FocusEvent<HTMLDivElement>) => {
      if (!editingPath) return;
      const related = e.relatedTarget as HTMLElement | null;
      const el = editingElRef.current;
      if (related && el && el.contains(related)) return;
      commitTextEdit(false);
    },
    [editingPath, commitTextEdit]
  );

  const handleSiteKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (!editingPath) return;
      if (e.target !== editingElRef.current) return;
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        commitTextEdit(false);
      } else if (e.key === 'Escape') {
        commitTextEdit(true);
      }
    },
    [editingPath, commitTextEdit]
  );

  const handleImageFile = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const key = imageKeyRef.current;
      const file = e.target.files?.[0];
      e.target.value = '';
      if (!key || !file || !project) return;
      try {
        const dataUrl = await resizeImageForStorage(file);
        const imagePrompts = { ...(project.config.imagePrompts ?? {}), [key]: dataUrl };
        persist({ ...project.config, imagePrompts } as SiteConfig);
      } catch {
        setImgError('Could not read that image. Please try another file.');
        window.setTimeout(() => setImgError(''), 3000);
      }
    },
    [project, persist]
  );

  const exitEditMode = useCallback(() => {
    commitTextEdit(false);
    setEditingSite(false);
  }, [commitTextEdit]);

  const Renderer = project ? rendererMap[project.templateId] : undefined;

  return (
    <div
      className={`sandbox-root ${editingSite ? 'editable-site' : ''}`}
      style={{ background: project?.config.theme.background ?? '#ffffff', minHeight: '100vh' }}
    >
      <div
        className="relative"
        onClickCapture={handleSiteClick}
        onBlurCapture={handleSiteFocusOut}
        onKeyDownCapture={handleSiteKeyDown}
      >
        {project && Renderer ? (
          <Suspense
            fallback={
              <div
                className="flex min-h-screen items-center justify-center"
                style={{ background: '#fff' }}
              >
                <span className="text-sm" style={{ opacity: 0.5 }}>
                  Loading preview…
                </span>
              </div>
            }
          >
            <Renderer config={project.config} />
          </Suspense>
        ) : (
          <div className="flex min-h-screen items-center justify-center">
            <span className="text-sm" style={{ opacity: 0.5 }}>
              Project not found
            </span>
          </div>
        )}
      </div>

      {editingSite && (
        <style>{`
          .editable-site p,
          .editable-site h1, .editable-site h2, .editable-site h3,
          .editable-site h4, .editable-site h5, .editable-site li,
          .editable-site dd, .editable-site dt, .editable-site figcaption,
          .editable-site td, .editable-site th, .editable-site span,
          .editable-site strong, .editable-site em, .editable-site blockquote {
            cursor: text;
          }
          .editable-site p:hover,
          .editable-site h1:hover, .editable-site h2:hover, .editable-site h3:hover,
          .editable-site h4:hover, .editable-site h5:hover, .editable-site li:hover,
          .editable-site dd:hover, .editable-site dt:hover { outline: 1px dashed rgba(0,0,0,0.22); outline-offset: 3px; }
          .editable-site img { cursor: pointer; }
          .editable-site img:hover { outline: 3px dashed rgba(0,0,0,0.35); outline-offset: 2px; }
        `}</style>
      )}

      {/* Top edit toggle / instructions */}
      <AnimatePresence>
        {!editingSite ? (
          <motion.button
            key="edit-toggle"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            onClick={() => setEditingSite(true)}
            className="fixed left-1/2 top-3 z-[60] flex items-center gap-2 rounded-full px-4 py-2 text-xs font-semibold shadow-lg"
            style={{ background: '#111111', color: '#fff', transform: 'translateX(-50%)' }}
          >
            <Pencil size={13} />
            Edit on site
          </motion.button>
        ) : (
          <motion.div
            key="edit-banner"
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            className="fixed left-1/2 top-3 z-[60] flex items-center gap-3 rounded-full px-4 py-2 text-xs font-medium shadow-lg"
            style={{ background: '#111111', color: '#fff', transform: 'translateX(-50%)' }}
          >
            <span>
              Click any <strong>text</strong> to edit it here · click an <strong>image</strong> to replace
            </span>
            <button
              onClick={exitEditMode}
              className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold"
              style={{ background: 'rgba(255,255,255,0.16)' }}
            >
              <X size={12} /> Done
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {editingPath && editingSite && (
        <div
          className="fixed left-1/2 z-[80] -translate-x-1/2 rounded-full px-3 py-1 text-[10px] font-semibold shadow"
          style={{ top: 52, background: 'rgba(17,17,17,0.85)', color: '#fff' }}
        >
          Editing: {editingPath} — Enter to save · Esc to cancel
        </div>
      )}

      {imgError && (
        <div
          className="fixed bottom-6 left-1/2 z-[70] max-w-[90vw] -translate-x-1/2 rounded-lg px-4 py-2 text-xs font-medium shadow-lg"
          style={{ background: '#111111', color: '#fff' }}
        >
          {imgError}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageFile}
      />
    </div>
  );
}