import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, LifeBuoy, Bug, Clock } from 'lucide-react';

/**
 * Where contact messages are delivered. Website Builder is operated by WB Roots
 * (Webnique Digital Solutions Pvt. Ltd.).
 */
const CONTACT_EMAIL = 'support@wb-roots.com';

const REASONS = [
  { icon: MessageSquare, label: 'General question' },
  { icon: LifeBuoy, label: 'Billing or credits' },
  { icon: Bug, label: 'Report a bug' },
  { icon: Mail, label: 'Partnerships' },
];

const inputClass =
  'w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-surface)] px-4 py-3 text-sm text-[var(--app-fg)] outline-none transition-colors placeholder:text-[var(--app-muted)] focus:border-[var(--app-fg)]';

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [reason, setReason] = useState(REASONS[0].label);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');

    if (!name.trim()) return setError('Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      return setError('Please enter a valid e-mail address.');
    if (message.trim().length < 10) return setError('Please add a little more detail (10+ characters).');

    const subject = `[${reason}] ${name.trim()}`;
    const body = `${message.trim()}\n\n---\nFrom: ${name.trim()} <${email.trim()}>`;
    const href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = href;
    setSent(true);
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        {/* Header block */}
        <div className="mx-auto max-w-2xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--app-muted)]"
          >
            <Mail size={13} className="text-[#F79A1B]" />
            We reply to every message
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Contact us
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-base text-[var(--app-muted)]"
          >
            Questions about a template, a problem with a generated site, or a feature you would like
            to see. Website Builder is a WB Roots product &mdash; tell us what is going on and we
            will get back to you.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[1fr_320px]">
          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            {sent ? (
              <div className="flex flex-col items-center rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-12 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-surface-hover)]">
                  <Mail size={20} className="text-[var(--app-fg)]" strokeWidth={1.5} />
                </div>
                <h2 className="mt-5 text-lg font-semibold tracking-tight">Your e-mail client should be open</h2>
                <p className="mt-2 max-w-sm text-sm leading-relaxed text-[var(--app-muted)]">
                  We have prepared the message for you. If nothing opened, email us directly at{' '}
                  <a href={`mailto:${CONTACT_EMAIL}`} className="font-medium text-[var(--app-fg)] underline underline-offset-2">
                    {CONTACT_EMAIL}
                  </a>
                  .
                </p>
                <button
                  type="button"
                  className="btn-secondary mt-8"
                  onClick={() => {
                    setSent(false);
                    setMessage('');
                  }}
                >
                  Write another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
              >
                <div className="grid gap-5 sm:grid-cols-2">
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">Name</span>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Your name"
                      className={inputClass}
                      autoComplete="name"
                    />
                  </label>
                  <label className="flex flex-col gap-2">
                    <span className="text-sm font-medium">E-mail</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      className={inputClass}
                      autoComplete="email"
                    />
                  </label>
                </div>

                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">What is this about?</span>
                  <div className="flex flex-wrap gap-2">
                    {REASONS.map((r) => (
                      <button
                        key={r.label}
                        type="button"
                        onClick={() => setReason(r.label)}
                        className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                          reason === r.label
                            ? 'border-[var(--app-fg)] bg-[var(--app-fg)] text-[var(--app-bg)]'
                            : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)]'
                        }`}
                      >
                        <r.icon size={13} strokeWidth={1.5} />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                <label className="flex flex-col gap-2">
                  <span className="text-sm font-medium">Message</span>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={6}
                    placeholder="Tell us what you need, and include any details that would help us help you."
                    className={`${inputClass} resize-y`}
                  />
                </label>

                {error && <p className="text-sm font-medium text-red-500">{error}</p>}

                <button type="submit" className="btn-primary self-start">
                  Send message
                </button>

                <p className="text-xs leading-relaxed text-[var(--app-muted)]">
                  Submitting opens your default e-mail client with the message pre-filled. We only
                  use your address to reply &mdash; see the{' '}
                  <Link to="/terms" className="underline underline-offset-2">
                    Terms of Service
                  </Link>
                  .
                </p>
              </form>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col gap-4"
          >
            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
              <h2 className="text-sm font-semibold tracking-tight">E-mail us directly</h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 block break-all text-sm text-[var(--app-muted)] underline underline-offset-2 transition-colors hover:text-[var(--app-fg)]"
              >
                {CONTACT_EMAIL}
              </a>
            </div>

            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
              <h2 className="text-sm font-semibold tracking-tight">Before you write</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">
                Pricing and credit balances are on the{' '}
                <Link to="/pricing" className="underline underline-offset-2">
                  Pricing
                </Link>{' '}
                page. The full rules for using the builder are in the{' '}
                <Link to="/terms" className="underline underline-offset-2">
                  Terms
                </Link>
                , and there is more about how we build in{' '}
                <Link to="/about" className="underline underline-offset-2">
                  About us
                </Link>
                .
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
              <Clock size={18} className="shrink-0 text-[var(--app-fg)]" strokeWidth={1.5} />
              <p className="text-xs leading-relaxed text-[var(--app-muted)]">
                Support runs Monday to Friday. We aim to reply within one business day.
              </p>
            </div>

            <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
              <h2 className="text-sm font-semibold tracking-tight">Operated by</h2>
              <p className="mt-2 text-sm leading-relaxed text-[var(--app-muted)]">
                WB Roots, a product of Webnique Digital Solutions Pvt. Ltd.
              </p>
              <a
                href="https://www.wb-roots.com"
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-block text-sm text-[var(--app-fg)] underline underline-offset-2"
              >
                www.wb-roots.com
              </a>
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
}