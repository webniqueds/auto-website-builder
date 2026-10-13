import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Tablet, Smartphone } from 'lucide-react';
import type { SiteConfig } from '../types';
import { cn } from '../lib/utils';

type Device = 'desktop' | 'tablet' | 'mobile';

interface PreviewFrameProps {
  device: Device;
  config: SiteConfig;
  projectId: string;
  onDeviceChange: (device: Device) => void;
  rev?: number;
}

const devices = [
  { key: 'desktop' as const, icon: Monitor, label: 'Desktop', width: '100%' },
  { key: 'tablet' as const, icon: Tablet, label: 'Tablet', width: 768 },
  { key: 'mobile' as const, icon: Smartphone, label: 'Mobile', width: 375 },
];

export default function PreviewFrame({ device, config, projectId, onDeviceChange, rev = 0 }: PreviewFrameProps) {
  const active = devices.find((d) => d.key === device) ?? devices[0];
  const src = `${window.location.origin}/preview-sandbox/${encodeURIComponent(projectId)}?device=${device}&v=${rev}`;

  return (
    <div className="preview-frame flex min-h-0 flex-1 flex-col">
      {/* Chrome bar */}
      <div className="preview-chrome">
        <div className="preview-dot" style={{ background: '#FF5F57' }} />
        <div className="preview-dot" style={{ background: '#FFBD2E' }} />
        <div className="preview-dot" style={{ background: '#28CA42' }} />
        <a
          href={src}
          target="_blank"
          rel="noreferrer"
          className="preview-url"
          title="Open site in a new tab"
        >
          {config.brandName
            ? `${config.brandName.toLowerCase().replace(/[^a-z0-9]/g, '')}.websitebuilder.dev`
            : 'preview.websitebuilder.dev'}
        </a>
      </div>

      {/* Device switcher */}
      <div className="flex items-center justify-center gap-1 border-b border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-2">
        {devices.map((d) => {
          const Icon = d.icon;
          const isActive = d.key === device;
          return (
            <button
              key={d.key}
              onClick={() => onDeviceChange(d.key)}
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

      {/* Content area */}
      <div className="relative flex min-h-0 flex-1 justify-center overflow-hidden bg-[var(--app-bg)] p-2 sm:p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={device}
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="h-full overflow-hidden rounded-lg border border-[var(--app-border)] bg-white shadow-sm"
            style={{
              width: typeof active.width === 'number' ? active.width : '100%',
              maxWidth: '100%',
              display: 'flex',
            }}
          >
            <iframe
              key={src}
              src={src}
              title="Site preview"
              className="h-full w-full"
              style={{ border: 'none', background: '#fff' }}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}