import { Suspense, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Monitor, Tablet, Smartphone, Sparkles } from 'lucide-react';
import { getTemplate } from '../templates/index';
import { rendererMap } from '../lib/rendererMap';
import { cn } from '../lib/utils';
import type { SiteConfig } from '../types';

type Device = 'desktop' | 'tablet' | 'mobile';

const devices = [
  { key: 'desktop' as const, icon: Monitor, label: 'Desktop', width: '100%' as const },
  { key: 'tablet' as const, icon: Tablet, label: 'Tablet', width: 768 },
  { key: 'mobile' as const, icon: Smartphone, label: 'Mobile', width: 375 },
];

export default function TemplatePreviewPage() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const template = templateId ? getTemplate(templateId) : undefined;
  const [device, setDevice] = useState<Device>('desktop');

  const config = useMemo<SiteConfig | null>(() => {
    if (!template) return null;
    const { defaultContent, metadata } = template;
    const site = (defaultContent.site ?? {}) as Partial<SiteConfig>;
    const sections = (defaultContent.sections ?? {}) as SiteConfig['sections'];
    return {
      brandName: site.brandName || metadata.name,
      tagline: site.tagline || '',
      description: site.description || metadata.description,
      ctaPrimary: site.ctaPrimary || 'Get Started',
      ctaSecondary: site.ctaSecondary || 'Learn more',
      niche: metadata.category,
      theme: metadata.theme,
      sections,
      imagePrompts: {},
    };
  }, [template]);

  const Renderer = template ? rendererMap[template.metadata.id] : undefined;
  const active = devices.find((d) => d.key === device) ?? devices[0];

  if (!template || !config || !Renderer) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
        <h2
          className="mb-2 text-xl font-semibold tracking-tight"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Template not found
        </h2>
        <p className="mb-6 text-sm text-[var(--app-muted)]">
          The template you're looking for doesn't exist.
        </p>
        <Link to="/" className="btn-primary">
          Back to templates
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Toolbar */}
      <div className="sticky top-0 z-40 border-b border-[var(--app-border)] bg-[var(--app-bg)]/90 px-4 py-2.5 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-3">
          <Link
            to="/"
            className="flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-2.5 text-xs font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)] hover:text-[var(--app-fg)]"
          >
            <ArrowLeft size={14} />
            Templates
          </Link>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              {template.metadata.name}
            </div>
            <div className="truncate text-[10px] uppercase tracking-wider text-[var(--app-muted)]">
              {template.metadata.category}
            </div>
          </div>

          {/* Device switcher */}
          <div className="hidden items-center gap-1 rounded-full bg-[var(--app-surface)] p-1 sm:flex">
            {devices.map((d) => {
              const Icon = d.icon;
              const isActive = d.key === device;
              return (
                <button
                  key={d.key}
                  onClick={() => setDevice(d.key)}
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors',
                    isActive
                      ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                      : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)]'
                  )}
                >
                  <Icon size={12} strokeWidth={1.5} />
                  {d.label}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => navigate(`/configure/${templateId}`)}
            className="btn-primary h-8 shrink-0 px-4 text-[12px]"
          >
            <Sparkles size={13} />
            Customize & build
          </button>
        </div>
      </div>

      {/* Mobile device switcher */}
      <div className="flex items-center justify-center gap-1 border-b border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-2 sm:hidden">
        {devices.map((d) => {
          const Icon = d.icon;
          const isActive = d.key === device;
          return (
            <button
              key={d.key}
              onClick={() => setDevice(d.key)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-medium transition-colors',
                isActive
                  ? 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                  : 'text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)]'
              )}
            >
              <Icon size={12} strokeWidth={1.5} />
              {d.label}
            </button>
          );
        })}
      </div>

      {/* Preview surface */}
      <div className="flex min-h-0 flex-1 justify-center bg-[var(--app-bg)] p-3 sm:p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-fit overflow-hidden rounded-xl border border-[var(--app-border)] bg-white shadow-xl"
            style={{
              width: typeof active.width === 'number' ? active.width : '100%',
              maxWidth: '100%',
            }}
          >
            <div className="flex items-center gap-1.5 border-b border-[var(--app-border)] bg-[var(--app-surface)] px-3 py-1.5">
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FF5F57' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#FFBD2E' }} />
              <span className="h-2.5 w-2.5 rounded-full" style={{ background: '#28CA42' }} />
              <span className="ml-2 truncate rounded bg-[var(--app-bg)] px-2 py-0.5 text-[10px] text-[var(--app-muted)]">
                {config.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.websitebuilder.dev
              </span>
            </div>
            <Suspense
              fallback={
                <div className="flex min-h-[60vh] items-center justify-center">
                  <span className="text-sm" style={{ opacity: 0.5 }}>
                    Loading preview…
                  </span>
                </div>
              }
            >
              <Renderer config={config} />
            </Suspense>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="sticky bottom-0 z-40 border-t border-[var(--app-border)] bg-[var(--app-bg)]/90 px-4 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3">
          <p className="hidden text-xs text-[var(--app-muted)] sm:block">
            This is what your site could look like. Build it with your own niche, copy and colors.
          </p>
          <button
            onClick={() => navigate(`/configure/${templateId}`)}
            className="btn-primary ml-auto py-2.5 text-[13px]"
          >
            <Sparkles size={14} />
            Customize & build →
          </button>
        </div>
      </div>
    </div>
  );
}