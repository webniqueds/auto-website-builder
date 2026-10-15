import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Scale } from 'lucide-react';

const LAST_UPDATED = 'October 13, 2026';

const SECTIONS = [
  { id: 'acceptance', title: '1. Acceptance of Terms' },
  { id: 'service', title: '2. The Service' },
  { id: 'accounts', title: '3. Accounts and Authentication' },
  { id: 'credits', title: '4. Credits, Plans and Payments' },
  { id: 'content', title: '5. Your Content and Generated Sites' },
  { id: 'acceptable-use', title: '6. Acceptable Use' },
  { id: 'ip', title: '7. Intellectual Property' },
  { id: 'third-party', title: '8. Third-Party Services' },
  { id: 'availability', title: '9. Availability and Changes' },
  { id: 'liability', title: '10. Disclaimers and Liability' },
  { id: 'termination', title: '11. Termination' },
  { id: 'law', title: '12. Governing Law' },
  { id: 'contact-terms', title: '13. Contact' },
];

export default function Terms() {
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
            <Scale size={13} className="text-[#F79A1B]" />
            Last updated {LAST_UPDATED}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Terms of Service
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-base text-[var(--app-muted)]"
          >
            The rules for using Website Builder. Plain language where we can manage it, and the
            legally binding version where we cannot.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[220px_1fr]">
          {/* Table of contents */}
          <motion.nav
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            aria-label="Table of contents"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="text-[11px] font-semibold uppercase tracking-wider text-[var(--app-muted)]">
              On this page
            </h2>
            <ul className="mt-3 flex flex-col gap-1.5">
              {SECTIONS.map((s) => (
                <li key={s.id}>
                  <a
                    href={`#${s.id}`}
                    className="text-[13px] text-[var(--app-muted)] transition-colors hover:text-[var(--app-fg)]"
                  >
                    {s.title}
                  </a>
                </li>
              ))}
            </ul>
          </motion.nav>

          {/* Body */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="flex flex-col gap-10">
              <Section id="acceptance" title="1. Acceptance of Terms">
                <p>
                  By creating an account or using Website Builder (the &ldquo;Service&rdquo;), you
                  agree to these Terms of Service. If you do not agree, do not use the Service. If
                  you are using the Service on behalf of a company, you confirm you have authority
                  to bind that company, and &ldquo;you&rdquo; refers to that company.
                </p>
                <p>
                  These Terms form an agreement between you and WB Roots, a product of Webnique
                  Digital Solutions Pvt. Ltd. (&ldquo;we&rdquo;, &ldquo;us&rdquo;), the operator of
                  Website Builder. They supersede any earlier statements about the Service. We may
                  revise these Terms; the &ldquo;Last updated&rdquo; date above always reflects the
                  current version.
                </p>
              </Section>

              <Section id="service" title="2. The Service">
                <p>
                  Website Builder is a tool that generates website designs from a selection of
                  templates and AI-assisted content. You choose a template, describe what you want,
                  and the Service produces a site you can preview, edit and export.
                </p>
                <p>
                  We may add, change, suspend or remove features at any time. We aim to keep the
                  Service available but do not guarantee that it will be uninterrupted or that any
                  generated output will be suitable for your purposes. Generated content is
                  machine-produced and should be reviewed before you publish it.
                </p>
              </Section>

              <Section id="accounts" title="3. Accounts and Authentication">
                <p>
                  You are responsible for the accuracy of your account information and for keeping
                  your credentials confidential. Authentication is handled by a third-party identity
                  provider. You are responsible for activity that occurs under your account,
                  including activity by anyone you share access with.
                </p>
                <p>
                  You must be old enough to form a binding contract in your jurisdiction to open an
                  account. Notify us promptly if you believe your account has been accessed without
                  your permission.
                </p>
              </Section>

              <Section id="credits" title="4. Credits, Plans and Payments">
                <p>
                  Generation is metered in credits. New accounts receive a small number of free
                  credits. Additional credits are sold as one-time purchases; see the{' '}
                  <Link to="/pricing" className="underline underline-offset-2">
                    Pricing
                  </Link>{' '}
                  page for current packages and prices.
                </p>
                <p>
                  Credits are consumed when a generation runs. Payments are processed by a
                  third-party payment provider; we do not store your full card details. Fees are
                  exclusive of taxes unless stated otherwise. Unless required by law or stated on the
                  Pricing page, purchases are final and non-refundable. A purchased plan unlocks
                  export functionality on your account and does not transfer to another account.
                </p>
              </Section>

              <Section id="content" title="5. Your Content and Generated Sites">
                <p>
                  You keep all rights to content you provide to the Service, such as brand names,
                  descriptions and images you upload or supply. You grant us a limited licence to
                  host and process that content solely to operate the Service for you.
                </p>
                <p>
                  You are responsible for ensuring you have the rights to everything you submit, and
                  that your content does not infringe third-party rights or break applicable law.
                  Exported sites are yours to use. We make no claim of ownership over your exported
                  output.
                </p>
              </Section>

              <Section id="acceptable-use" title="6. Acceptable Use">
                <p>You agree not to use the Service to:</p>
                <ul>
                  <li>Generate or publish unlawful, defamatory, or infringing material.</li>
                  <li>Impersonate a person or organisation, or misrepresent generated content.</li>
                  <li>
                    Produce spam, malware, phishing pages, or deceptive sites intended to harvest
                    credentials or financial information.
                  </li>
                  <li>
                    Circumvent rate limits, credit limits, or any access control on the Service.
                  </li>
                  <li>
                    Scrape, resell, or reverse engineer the Service, except where that restriction is
                    prohibited by law.
                  </li>
                </ul>
                <p>
                  We may suspend or terminate access immediately if you breach this section or if we
                  are required to do so by law or a third-party complaint.
                </p>
              </Section>

              <Section id="ip" title="7. Intellectual Property">
                <p>
                  The Service, including its software, templates, design system, branding and
                  underlying code, is owned by WB Roots (Webnique Digital Solutions Pvt. Ltd.) or its
                  licensors. We grant you a non-exclusive, non-transferable licence to use the
                  Service as intended. Nothing else is granted.
                </p>
              </Section>

              <Section id="third-party" title="8. Third-Party Services">
                <p>
                  The Service relies on third-party providers for identity, payments, AI generation
                  and image sourcing. Their services are governed by their own terms, and we are not
                  responsible for their availability, content or conduct. Your use of them is
                  subject to our configuration of them at the time you use the Service.
                </p>
              </Section>

              <Section id="availability" title="9. Availability and Changes">
                <p>
                  We are constantly changing the Service, which may mean features, limits or prices
                  change over time. We may discontinue any feature with or without notice. Where a
                  material change reduces the value of what you have paid for, we will offer a
                  reasonable refund or credit at our discretion.
                </p>
              </Section>

              <Section id="liability" title="10. Disclaimers and Liability">
                <p>
                  The Service is provided &ldquo;as is&rdquo; and &ldquo;as available&rdquo;. To the
                  fullest extent permitted by law, we disclaim all implied warranties, including
                  merchantability, fitness for a particular purpose and non-infringement. We do not
                  warrant that output will be accurate, error-free or legally compliant.
                </p>
                <p>
                  To the fullest extent permitted by law, our total liability arising out of or
                  relating to the Service is limited to the greater of the amount you paid us in the
                  twelve months before the claim or USD 50. We are not liable for indirect,
                  incidental, special, consequential or punitive damages, or for lost profits, data or
                  goodwill. Nothing here excludes liability that cannot lawfully be excluded.
                </p>
              </Section>

              <Section id="termination" title="11. Termination">
                <p>
                  You may stop using the Service and delete your account at any time. We may
                  suspend or terminate your account for breach of these Terms, non-payment, or if we
                  discontinue the Service. On termination, your right to use the Service ends
                  immediately, but sections that by their nature should survive &mdash; including
                  ownership, disclaimers, liability and dispute terms &mdash; do survive.
                </p>
              </Section>

              <Section id="law" title="12. Governing Law">
                <p>
                  These Terms and any dispute or claim arising out of or in connection with them or
                  the Service are governed by and construed in accordance with the laws of India.
                  The courts at India shall have exclusive jurisdiction, subject to any mandatory
                  provisions of applicable consumer law. Nothing in this section prevents either
                  party from seeking relief in any court of competent jurisdiction where required.
                </p>
              </Section>

              <Section id="contact-terms" title="13. Contact">
                <p>
                  Questions about these Terms can be sent through the{' '}
                  <Link to="/contact" className="underline underline-offset-2">
                    Contact us
                  </Link>{' '}
                  page. We will aim to respond within a reasonable time.
                </p>
              </Section>
            </div>

            <div className="mt-14 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center">
              <p className="text-sm text-[var(--app-muted)]">
                Ready to build something?{' '}
                <Link to="/" className="font-medium text-[var(--app-fg)] underline underline-offset-2">
                  Browse the templates
                </Link>{' '}
                and start on your free credits.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/**
 * A numbered clause with an anchor id so the table of contents can deep-link it.
 * index.css already applies scroll-margin-top to section[id].
 */
function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 flex flex-col gap-3 text-sm leading-relaxed text-[var(--app-muted)] [&_a]:text-[var(--app-fg)] [&_li]:pl-1 [&_ul]:flex [&_ul]:list-disc [&_ul]:flex-col [&_ul]:gap-2 [&_ul]:pl-5">
        {children}
      </div>
    </section>
  );
}