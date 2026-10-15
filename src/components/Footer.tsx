import { Link } from 'react-router-dom';
import { cn } from '../lib/utils';

const SUPPORT_EMAIL = 'support@wb-roots.com';

/** External WB Roots product links shown in the footer. */
const PRODUCTS = [
  { href: 'https://www.wb-roots.com', label: 'WB Roots' },
  { href: 'https://wbflow.wb-roots.com', label: 'WBFlow' },
  { href: 'https://quip.wb-roots.com', label: 'Quip AI' },
  { href: 'https://www.wb-roots.com', label: 'All Solutions' },
];

const COMPANY = [
  { to: '/about', label: 'About Us' },
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/contact', label: 'Contact Us' },
];

const TOOL = [
  { to: '/', label: 'Templates' },
  { to: '/projects', label: 'My Projects' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Support' },
];

/**
 * Site-wide WB Roots footer. Rendered on every non-immersive route so legal,
 * product and contact links stay reachable from anywhere in the app.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-[var(--app-border)] bg-[var(--app-surface)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 max-w-sm">
            <Link to="/" className="flex items-center gap-2">
              <span
                className="text-lg font-bold tracking-tight"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                Website Builder
              </span>
            </Link>
            <p className="mt-3 text-[13px] leading-relaxed text-[var(--app-muted)]">
              A WB Roots product. Describe your business and generate a launch-ready website in
              minutes &mdash; then edit, export and host it anywhere.
            </p>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="mt-4 inline-block text-[13px] font-medium text-[var(--app-fg)] underline underline-offset-2"
            >
              {SUPPORT_EMAIL}
            </a>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--app-muted)]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              All systems operational
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
              Products
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {PRODUCTS.map((p) => (
                <li key={p.label}>
                  <a
                    href={p.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[13px] text-[var(--app-muted)] transition-colors hover:text-[var(--app-fg)]"
                  >
                    {p.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
              Company
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMPANY.map((c) => (
                <li key={c.to}>
                  <Link
                    to={c.to}
                    className="text-[13px] text-[var(--app-muted)] transition-colors hover:text-[var(--app-fg)]"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Tool */}
          <div>
            <h3 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
              This Tool
            </h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {TOOL.map((t) => (
                <li key={t.label}>
                  <Link
                    to={t.to}
                    className={cn(
                      'text-[13px] text-[var(--app-muted)] transition-colors',
                      'hover:text-[var(--app-fg)]'
                    )}
                  >
                    {t.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Trust strip */}
        <div className="mt-12 rounded-2xl border border-[var(--app-border)] bg-[var(--app-bg)] px-5 py-4 text-center">
          <p className="text-[12px] font-medium text-[var(--app-fg)]">
            🇮🇳 Built in India &mdash; empowering regional businesses with global-standard technology.
          </p>
        </div>

        {/* Legal bar */}
        <div className="mt-8 flex flex-col items-center gap-3 border-t border-[var(--app-border)] pt-6 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="flex flex-col gap-1">
            <p className="text-[11px] text-[var(--app-muted)]">
              &copy; {year} WB Roots. All Rights Reserved.
            </p>
            <p className="text-[11px] text-[var(--app-muted)]">
              A Product of Webnique Digital Solutions Pvt. Ltd.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-[11px] text-[var(--app-muted)] underline underline-offset-2 transition-colors hover:text-[var(--app-fg)]"
            >
              Privacy
            </Link>
            <Link
              to="/terms"
              className="text-[11px] text-[var(--app-muted)] underline underline-offset-2 transition-colors hover:text-[var(--app-fg)]"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
