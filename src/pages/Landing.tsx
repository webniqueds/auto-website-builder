import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Wand2, Palette, Download, ShieldCheck, Zap, Layers } from 'lucide-react';
import { getAllTemplates } from '../templates/index';
import TemplateCard from '../components/TemplateCard';

const STEPS = [
  {
    icon: Layers,
    title: 'Pick a template',
    text: 'Fourteen designed starting points, each with its own structure and type scale.',
  },
  {
    icon: Wand2,
    title: 'Describe your idea',
    text: 'Tell us your business and audience. Content is written around your answer.',
  },
  {
    icon: Download,
    title: 'Export and ship',
    text: 'Download clean static HTML and CSS you own and can host anywhere.',
  },
];

const FEATURES = [
  {
    icon: Sparkles,
    title: 'AI-written content',
    text: 'Real copy for your niche, not lorem ipsum. Every line is editable afterwards.',
  },
  {
    icon: Palette,
    title: 'Instant restyling',
    text: 'Swap palettes, images and sections. The live preview updates as you go.',
  },
  {
    icon: Zap,
    title: 'Minutes, not weeks',
    text: 'Go from a blank page to a launch-ready site in a single generation.',
  },
  {
    icon: ShieldCheck,
    title: 'Yours to keep',
    text: 'No lock-in and no watermark. Export readable HTML and CSS at any time.',
  },
];

const STATS = [
  { value: '14', label: 'Design templates' },
  { value: '6', label: 'Niche image sets' },
  { value: '3', label: 'Free credits to start' },
  { value: '0', label: 'Lines to hand-code' },
];

export default function Landing() {
  const navigate = useNavigate();
  const templates = getAllTemplates();

  function handleSelect(templateId: string) {
    navigate(`/template/${templateId}`);
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Soft background wash */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(60% 55% at 50% 0%, rgba(247,154,27,0.14) 0%, rgba(247,154,27,0) 60%), radial-gradient(40% 40% at 85% 20%, rgba(17,17,17,0.06) 0%, rgba(17,17,17,0) 70%)',
          }}
        />
        <div className="mx-auto max-w-5xl px-6 pt-24 pb-16 text-center sm:pt-32 sm:pb-20">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--app-muted)]"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#F79A1B] opacity-70" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[#F79A1B]" />
            </span>
            A WB Roots product
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl font-medium leading-[1.08] tracking-tight sm:text-5xl md:text-6xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Build from a good foundation.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-[var(--app-muted)] sm:text-lg"
          >
            Choose a template. Describe your idea. We shape the design, write the content and hand
            you a site you can edit, export and own.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <a href="#templates" className="btn-primary">
              <Sparkles size={15} />
              Start building free
            </a>
            <Link to="/pricing" className="btn-secondary">
              See pricing
            </Link>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mt-4 text-xs text-[var(--app-muted)]"
          >
            No card required &mdash; new accounts start with 3 free credits.
          </motion.p>
        </div>

        {/* Stats strip */}
        <div className="mx-auto max-w-4xl px-6 pb-20">
          <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-[var(--app-border)] bg-[var(--app-border)] sm:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.05 }}
                className="bg-[var(--app-surface)] px-5 py-6 text-center"
              >
                <div
                  className="text-2xl font-semibold tracking-tight"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {s.value}
                </div>
                <div className="mt-1 text-[11px] uppercase tracking-wide text-[var(--app-muted)]">
                  {s.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-3xl font-medium tracking-tight sm:text-4xl"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              Everything you need to launch
            </h2>
            <p className="mt-4 text-base text-[var(--app-muted)]">
              A complete starting point &mdash; design, copy, imagery and export included.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
                className="flex flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-7 transition-shadow hover:shadow-[0_8px_30px_rgba(0,0,0,0.05)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F79A1B]/10 text-[#B45309]">
                  <f.icon size={18} strokeWidth={1.8} />
                </span>
                <h3 className="mt-5 text-base font-semibold tracking-tight">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">{f.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--app-border)] bg-[var(--app-surface)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2
              className="text-3xl font-medium tracking-tight sm:text-4xl"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              Three steps to live
            </h2>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {STEPS.map((s, i) => (
              <motion.div
                key={s.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="relative rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg)] p-7"
              >
                <span
                  className="text-5xl font-semibold leading-none text-[var(--app-border)]"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  0{i + 1}
                </span>
                <s.icon size={20} className="mt-4 text-[var(--app-fg)]" strokeWidth={1.6} />
                <h3 className="mt-3 text-base font-semibold tracking-tight">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates grid */}
      <section id="templates" className="mx-auto max-w-6xl scroll-mt-20 px-6 py-20 sm:py-24">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-3 text-sm font-semibold uppercase tracking-wider text-[var(--app-muted)]"
        >
          Choose a template
        </motion.h2>
        <p className="mb-10 max-w-xl text-sm text-[var(--app-muted)]">
          Every template is fully editable. Start from the one closest to your idea.
        </p>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t, i) => (
            <motion.div
              key={t.metadata.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: Math.min(i * 0.04, 0.4) }}
            >
              <TemplateCard template={t} onSelect={handleSelect} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Your website is one sentence away.
          </motion.h2>
          <p className="mx-auto mt-4 max-w-md text-base text-[var(--app-muted)]">
            Tell us what you do and watch a complete site take shape.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a href="#templates" className="btn-primary">
              Browse templates
            </a>
            <Link to="/about" className="btn-secondary">
              Learn more
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
