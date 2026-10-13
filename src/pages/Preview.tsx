import { useState, useCallback, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Pencil,
  Download,
  Save,
  History,
  AlertTriangle,
  RefreshCw,
  ExternalLink,
  SlidersHorizontal,
} from 'lucide-react';
import { getProject, updateProject } from '../lib/storage';
import { editSite, generateSiteV2 } from '../lib/ai';
import PreviewFrame from '../components/PreviewFrame';
import EditableCommand from '../components/EditableCommand';
import VersionHistory from '../components/VersionHistory';
import UpgradeModal from '../components/UpgradeModal';
import PageEditor from '../components/PageEditor';
import { hasPurchaseAccess, getCredits, spendCredit, spendHalfCredit, ensureInitialCredits } from '../lib/plans';
import { buildSiteHtml, downloadSiteHtml } from '../lib/exportSite';
import type { SiteConfig } from '../types';

export default function Preview() {
  const { projectId } = useParams<{ projectId: string }>();
  const project = projectId ? getProject(projectId) : null;

  const [config, setConfig] = useState<SiteConfig | null>(project?.config ?? null);
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [editMode, setEditMode] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [notice, setNotice] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [exporting, setExporting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [rev, setRev] = useState(0);
  const [versions, setVersions] = useState(project?.versions ?? []);
  const [currentVersion, setCurrentVersion] = useState(project?.currentVersion ?? 0);
  const variationRef = useRef(1);
  const commitRef = useRef<number>(0);

  useEffect(() => {
    if (project) {
      setConfig(project.config);
      setVersions(project.versions);
      setCurrentVersion(project.currentVersion);
    }
  }, [project]);

  useEffect(() => {
    if (!notice) return;
    const t = setTimeout(() => setNotice(null), 4000);
    return () => clearTimeout(t);
  }, [notice]);

  useEffect(() => {
    return () => window.clearTimeout(commitRef.current);
  }, []);

  const handleConfigChange = useCallback(
    (next: SiteConfig) => {
      setConfig(next);
      window.clearTimeout(commitRef.current);
      commitRef.current = window.setTimeout(() => {
        if (!project) return;
        updateProject({ ...project, config: next, updatedAt: Date.now() });
        setRev((r) => r + 1);
      }, 600);
    },
    [project]
  );

  const handleEdit = useCallback(
    async (change: string) => {
      if (!config || !project || isProcessing) return;

      // Credit gate — AI edits cost 0.5 credits.
      ensureInitialCredits();
      if (getCredits() <= 0) {
        setShowUpgrade(true);
        return;
      }

      setIsProcessing(true);
      setNotice(null);
      try {
        const newConfig = await editSite({
          templateId: project.templateId,
          currentConfig: config,
          change,
        });
        const newVersion = {
          id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
          config: newConfig,
          label: change,
          createdAt: Date.now(),
        };
        const newVersions = [...versions, newVersion];
        setConfig(newConfig);
        setVersions(newVersions);
        setCurrentVersion(newVersions.length - 1);

        updateProject({
          ...project,
          config: newConfig,
          versions: newVersions,
          currentVersion: newVersions.length - 1,
          updatedAt: Date.now(),
        });
        // Deduct after success so a failed API call doesn't cost credits.
        spendHalfCredit();
        setNotice({ type: 'success', text: 'Edit applied' });
      } catch (err) {
        setNotice({
          type: 'error',
          text: err instanceof Error ? err.message : 'Edit failed. Please try again.',
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [config, project, isProcessing, versions]
  );

  const handleRegenerate = useCallback(async () => {
    if (!project || !config || isRegenerating) return;

    // Credit gate — Regeneration costs 1 credit (same as a new generation).
    ensureInitialCredits();
    if (getCredits() <= 0) {
      setShowUpgrade(true);
      return;
    }

    setIsRegenerating(true);
    setNotice(null);
    try {
      const newConfig = await generateSiteV2(
        {
          templateId: project.templateId,
          niche: project.niche,
          palette: project.palette,
          description: '',
          additionalInstructions: '',
          variation: variationRef.current,
        },
        () => {}
      );
      variationRef.current += 1;
      const newVersion = {
        id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
        config: newConfig,
        label: 'Regenerated',
        createdAt: Date.now(),
      };
      const newVersions = [...versions, newVersion];
      setConfig(newConfig);
      setVersions(newVersions);
      setCurrentVersion(newVersions.length - 1);
      updateProject({
        ...project,
        config: newConfig,
        versions: newVersions,
        currentVersion: newVersions.length - 1,
        updatedAt: Date.now(),
      });
      // Deduct after success so a failed API call doesn't cost credits.
      spendCredit();
      setNotice({ type: 'success', text: 'Site regenerated' });
    } catch (err) {
      setNotice({
        type: 'error',
        text: err instanceof Error ? err.message : 'Regeneration failed. Please try again.',
      });
    } finally {
      setIsRegenerating(false);
    }
  }, [project, config, isRegenerating, versions]);

  const handleRestore = useCallback(
    (versionId: string) => {
      if (!project) return;
      const idx = versions.findIndex((v) => v.id === versionId);
      if (idx === -1) return;
      const restored = versions[idx];
      setConfig(restored.config);
      setCurrentVersion(idx);
      updateProject({
        ...project,
        config: restored.config,
        currentVersion: idx,
      });
    },
    [project, versions]
  );

  const handleExport = useCallback(async () => {
    if (!config || !project || exporting) return;
    if (!hasPurchaseAccess()) {
      setShowUpgrade(true);
      return;
    }
    setExporting(true);
    try {
      const html = await buildSiteHtml(config, project.templateId);
      downloadSiteHtml(html, config.brandName || 'my-website');
    } catch {
      setNotice({ type: 'error', text: 'Could not build the site code. Please try again.' });
    } finally {
      setExporting(false);
    }
  }, [config, project, exporting]);

  const handleSave = useCallback(() => {
    if (!project || !config) return;
    updateProject({ ...project, config, versions, currentVersion, updatedAt: Date.now() });
    setNotice({ type: 'success', text: 'Saved' });
  }, [project, config, versions, currentVersion]);

  if (!project || !config) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <AlertTriangle size={40} className="mb-4 text-[var(--app-muted)]" />
        <h2
          className="mb-2 text-xl font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Project not found
        </h2>
        <p className="mb-6 text-sm text-[var(--app-muted)]">
          This project may have been deleted or the link is invalid.
        </p>
        <Link to="/" className="btn-primary">
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top toolbar */}
      <div
        className="sticky top-0 z-40 flex items-center gap-2 overflow-x-auto border-b border-[var(--app-border)] px-4 py-2"
        style={{
          background: 'rgba(248,247,244,0.9)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
        }}
      >
        {notice && (
          <div
            className={`absolute left-1/2 top-full z-50 mt-2 -translate-x-1/2 rounded-lg border px-4 py-2 text-xs font-medium shadow-lg ${
              notice.type === 'error'
                ? 'border-red-200 bg-red-50 text-red-600'
                : 'border-emerald-200 bg-emerald-50 text-emerald-600'
            }`}
          >
            {notice.text}
          </div>
        )}
        <Link
          to="/projects"
          className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]"
        >
          <ArrowLeft size={14} />
          <span className="hidden sm:inline">Projects</span>
        </Link>

        <div className="flex-1 text-center">
          <span
            className="hidden truncate text-xs font-semibold tracking-tight sm:inline"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            {config.brandName}
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <a
            href={`/preview-sandbox/${encodeURIComponent(project.id)}?device=${device}`}
            target="_blank"
            rel="noreferrer"
            className="flex h-8 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]"
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">Open site</span>
          </a>

          <button
            onClick={() => setEditMode((m) => !m)}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors ${
              editMode
                ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]'
            }`}
          >
            <Pencil size={13} />
            <span className="hidden sm:inline">Edit</span>
          </button>

          <button
            onClick={() => setShowEditor((s) => !s)}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors ${
              showEditor
                ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]'
            }`}
          >
            <SlidersHorizontal size={13} />
            <span className="hidden sm:inline">Customize</span>
          </button>

          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCw size={13} className={isRegenerating ? 'animate-spin' : ''} />
            <span className="hidden sm:inline">
              {isRegenerating ? 'Regenerating' : 'Regenerate'}
            </span>
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Download size={13} />
            <span className="hidden sm:inline">{exporting ? 'Building…' : 'Download code'}</span>
          </button>

          <button
            onClick={handleSave}
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]"
          >
            <Save size={13} />
            <span className="hidden sm:inline">Save</span>
          </button>

          <button
            onClick={() => setShowHistory((h) => !h)}
            className={`flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium transition-colors ${
              showHistory
                ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]'
            }`}
          >
            <History size={13} />
          </button>
        </div>
      </div>

      {/* Main area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Preview */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden p-4">
          <PreviewFrame
            device={device}
            config={config}
            projectId={project.id}
            onDeviceChange={setDevice}
            rev={rev}
          />
        </div>

        {/* Version history panel */}
        <AnimatePresence>
          {showHistory && (
            <div className="hidden shrink-0 p-4 lg:block">
              <VersionHistory
                versions={versions}
                currentVersion={currentVersion}
                onRestore={handleRestore}
              />
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Edit command bar */}
      <AnimatePresence>
        {editMode && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="sticky bottom-0 z-40 border-t border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3"
            style={{
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              background: 'rgba(248,247,244,0.92)',
            }}
          >
            <div className="mx-auto max-w-2xl">
              <EditableCommand onSubmit={handleEdit} isProcessing={isProcessing} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Customize drawer */}
      <AnimatePresence>
        {showEditor && config && (
          <motion.div
            initial={{ x: 340 }}
            animate={{ x: 0 }}
            exit={{ x: 340 }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed inset-y-0 right-0 z-40 w-[360px] max-w-[92vw] border-l border-[var(--app-border)] bg-[var(--app-bg)] shadow-2xl"
            style={{ top: 64 }}
          >
            <PageEditor config={config} onChange={handleConfigChange} />
          </motion.div>
        )}
      </AnimatePresence>

      <UpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        reason="export"
      />
    </div>
  );
}
