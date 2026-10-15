import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutTemplate, Wand2, Download, Palette } from 'lucide-react';

const STEPS = [
  {
    icon: LayoutTemplate,
    title: 'Start from a template',
    text: 'Fourteen designed starting points, each with its own structure, spacing and type scale. Pick the one closest to what you have in mind.',
  },
  {
    icon: Wand2,
    title: 'Describe your business',
    text: 'Tell the builder what you do, who it is for and what you want to say. Content is written around your answer, not a generic placeholder.',
  },
  {
    icon: Palette,
    title: 'Edit anything',
    text: 'Change colours, swap images, rewrite any line. The preview updates as you go, so you are never editing blind.',
  },
  {
    icon: Download,
    title: 'Export and ship',
    text: 'Download clean static HTML and CSS. No lock-in, no runtime dependency on us, and no watermark on the files you own.',
  },
];

const PRINCIPLES = [
  {
    title: 'Templates are a starting point, not a cage',
    text: 'A template gets you to a good-looking page in minutes. Every piece of it is editable afterwards, because a layout you cannot change is just a screenshot.',
  },
  {
    title: 'Your content stays yours',
    text: 'What you export is yours to use, host and modify. We do not claim ownership of sites you build or attach our branding to them.',
  },
  {
    title: 'Credits, not surprises',
    text: 'One credit, one generated site. You can see your balance before you generate, and nothing renews on a subscription you forgot about.',
  },
  {
    title: 'Plain, static output',
    text: 'We hand you HTML and CSS you can read. No proprietary runtime, no lock-in, and no ongoing fee just to keep a page online.',
  },
];

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-24 pb-20 text-center sm:pt-32 sm:pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--app-muted)]"
        >
          <LayoutTemplate size={13} className="text-[#F79A1B]" />
          About us
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl font-medium leading-[1.1] tracking-tight sm:text-5xl md:text-6xl"
          style={{ fontFamily: 'var(--font-editorial)' }}
        >
          We build the starting point,
          <br />
          you build the website.
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="mx-auto mt-6 max-w-lg text-base leading-relaxed text-[var(--app-muted)] sm:text-lg"
        >
          Website Builder is a WB Roots product, built for the moment after you have an idea and
          before you have a designer on speed dial. We compress the blank page so you can spend your
          time on the part that actually matters: what the site says.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-3"
        >
          <Link to="/" className="btn-primary">
            Browse templates
          </Link>
          <Link to="/pricing" className="btn-secondary">
            See pricing
          </Link>
        </motion.div>
      </section>

      {/* How it works */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 text-sm font-semibold uppercase tracking-wider text-[var(--app-muted)]"
          >
            How it works
          </motion.h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.05 }}
                className="flex flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
              >
                <step.icon size={20} className="text-[var(--app-fg)]" strokeWidth={1.5} />
                <h3 className="mt-4 text-base font-semibold tracking-tight">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">{step.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-10 text-sm font-semibold uppercase tracking-wider text-[var(--app-muted)]"
          >
            What we believe
          </motion.h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            {PRINCIPLES.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.15 + i * 0.05 }}
                className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
              >
                <h3 className="text-base font-semibold tracking-tight">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">{p.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About WB Roots */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="grid gap-10 lg:grid-cols-2 lg:items-start">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <h2
                className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
                style={{ fontFamily: 'var(--font-editorial)' }}
              >
                About WB Roots
              </h2>
              <p className="mt-5 text-base leading-relaxed text-[var(--app-muted)]">
                WB Roots is the complete solutions platform for modern businesses, built in India
                and empowering regional businesses with global-standard technology. Website Builder
                is one product in a family that includes{' '}
                <a
                  href="https://wbflow.wb-roots.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--app-fg)] underline underline-offset-2"
                >
                  WBFlow
                </a>{' '}
                and{' '}
                <a
                  href="https://quip.wb-roots.com"
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-[var(--app-fg)] underline underline-offset-2"
                >
                  Quip AI
                </a>
                .
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
            >
              <dl className="flex flex-col gap-4 text-sm">
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
                    Company
                  </dt>
                  <dd className="text-[var(--app-fg)]">Webnique Digital Solutions Pvt. Ltd.</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
                    Product
                  </dt>
                  <dd className="text-[var(--app-fg)]">Website Builder</dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
                    Support
                  </dt>
                  <dd>
                    <a
                      href="mailto:support@wb-roots.com"
                      className="text-[var(--app-fg)] underline underline-offset-2"
                    >
                      support@wb-roots.com
                    </a>
                  </dd>
                </div>
                <div className="flex flex-col gap-1">
                  <dt className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
                    Platform
                  </dt>
                  <dd>
                    <a
                      href="https://www.wb-roots.com"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[var(--app-fg)] underline underline-offset-2"
                    >
                      www.wb-roots.com
                    </a>
                  </dd>
                </div>
              </dl>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-[var(--app-border)]">
        <div className="mx-auto max-w-3xl px-6 py-20 text-center sm:py-24">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <h2
              className="text-3xl font-medium leading-tight tracking-tight sm:text-4xl"
              style={{ fontFamily: 'var(--font-editorial)' }}
            >
              Have something in mind?
            </h2>
            <p className="mx-auto mt-4 max-w-md text-base text-[var(--app-muted)]">
              Three free credits, no card required. If you get stuck or want to tell us what to build
              next, we would like to hear it.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link to="/" className="btn-primary">
                Start building
              </Link>
              <Link to="/contact" className="btn-secondary">
                Contact us
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}