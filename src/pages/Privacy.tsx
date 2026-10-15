import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

const LAST_UPDATED = 'October 15, 2026';
const SUPPORT_EMAIL = 'support@wb-roots.com';

const SECTIONS = [
  { id: 'overview', title: '1. Overview' },
  { id: 'collect', title: '2. Information We Collect' },
  { id: 'use', title: '3. How We Use Information' },
  { id: 'sharing', title: '4. Sharing and Third Parties' },
  { id: 'retention', title: '5. Retention and Security' },
  { id: 'rights', title: '6. Your Rights' },
  { id: 'cookies', title: '7. Cookies and Storage' },
  { id: 'children', title: '8. Children' },
  { id: 'changes', title: '9. Changes to This Policy' },
  { id: 'contact-privacy', title: '10. Contact' },
];

export default function Privacy() {
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
            <Lock size={13} className="text-[#F79A1B]" />
            Last updated {LAST_UPDATED}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            Privacy Policy
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-base text-[var(--app-muted)]"
          >
            How Website Builder, a WB Roots product, handles the information you give us.
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
              <Section id="overview" title="1. Overview">
                <p>
                  This Privacy Policy explains what information Website Builder collects, why we
                  collect it, and the choices you have. Website Builder is operated by WB Roots, a
                  product of Webnique Digital Solutions Pvt. Ltd.
                </p>
                <p>
                  By using the Service you agree to the handling of your information as described
                  here. If you do not agree, please do not use the Service.
                </p>
              </Section>

              <Section id="collect" title="2. Information We Collect">
                <p>We collect the following categories of information:</p>
                <ul>
                  <li>
                    <strong>Account information.</strong> Your name and e-mail address, handled by
                    our authentication provider when you sign in.
                  </li>
                  <li>
                    <strong>Content you provide.</strong> Business descriptions, brand names, copy
                    and any images you supply while building a site.
                  </li>
                  <li>
                    <strong>Generated projects.</strong> The templates, content and configuration of
                    sites you create, stored so you can return to them on any device.
                  </li>
                  <li>
                    <strong>Payment information.</strong> Purchase history and identifiers returned
                    by our payment provider. We do not store full card details.
                  </li>
                  <li>
                    <strong>Usage data.</strong> Basic technical information needed to operate,
                    secure and debug the Service.
                  </li>
                </ul>
              </Section>

              <Section id="use" title="3. How We Use Information">
                <p>We use your information to:</p>
                <ul>
                  <li>Provide the Service, including generating and storing your websites.</li>
                  <li>Authenticate you and keep your account secure.</li>
                  <li>Process payments and manage your credit balance.</li>
                  <li>Respond to support requests and improve the Service.</li>
                  <li>Comply with legal obligations and enforce our Terms of Service.</li>
                </ul>
                <p>We do not sell your personal information.</p>
              </Section>

              <Section id="sharing" title="4. Sharing and Third Parties">
                <p>
                  We share information with service providers who help us run the Service. These
                  currently include providers for authentication, payments, database hosting, AI
                  text generation and stock imagery. They receive only what they need to perform
                  their function, and their handling of your data is governed by their own terms and
                  privacy policies.
                </p>
                <p>
                  We may also disclose information where required by law, to protect the rights or
                  safety of users or the public, or as part of a merger or acquisition.
                </p>
              </Section>

              <Section id="retention" title="5. Retention and Security">
                <p>
                  We retain your information for as long as your account is active or as needed to
                  provide the Service, meet legal obligations and resolve disputes. When it is no
                  longer needed, we delete or anonymise it.
                </p>
                <p>
                  We use reasonable technical and organisational measures to protect your
                  information. No method of transmission or storage is completely secure, so we
                  cannot guarantee absolute security.
                </p>
              </Section>

              <Section id="rights" title="6. Your Rights">
                <p>
                  Depending on where you live, you may have the right to access, correct, export or
                  delete your personal information, or to object to certain processing. You can
                  manage much of this from your account, and you can contact us to make a request.
                  We will respond within the timeframe required by applicable law.
                </p>
              </Section>

              <Section id="cookies" title="7. Cookies and Storage">
                <p>
                  The Service uses cookies and browser storage that are necessary to keep you signed
                  in and to remember your session and preferences. We do not use them to sell your
                  data. You can clear them from your browser, though some parts of the Service may
                  stop working if you do.
                </p>
              </Section>

              <Section id="children" title="8. Children">
                <p>
                  The Service is not directed to children, and you must be old enough to form a
                  binding contract in your jurisdiction to use it. We do not knowingly collect
                  information from children. If you believe a child has provided us information,
                  contact us and we will delete it.
                </p>
              </Section>

              <Section id="changes" title="9. Changes to This Policy">
                <p>
                  We may update this Privacy Policy from time to time. Material changes will be
                  reflected in the &ldquo;Last updated&rdquo; date above and, where appropriate,
                  communicated to you. Continued use of the Service after a change means you accept
                  the updated policy.
                </p>
              </Section>

              <Section id="contact-privacy" title="10. Contact">
                <p>
                  Privacy questions and requests can be sent to{' '}
                  <a href={`mailto:${SUPPORT_EMAIL}`} className="underline underline-offset-2">
                    {SUPPORT_EMAIL}
                  </a>{' '}
                  or through the{' '}
                  <Link to="/contact" className="underline underline-offset-2">
                    Contact us
                  </Link>{' '}
                  page.
                </p>
              </Section>
            </div>

            <div className="mt-14 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8 text-center">
              <p className="text-sm text-[var(--app-muted)]">
                See also our{' '}
                <Link to="/terms" className="font-medium text-[var(--app-fg)] underline underline-offset-2">
                  Terms of Service
                </Link>
                .
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

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
