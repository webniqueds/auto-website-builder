import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Check, Sparkles, Zap, Coins, ShieldCheck, BadgeCheck } from 'lucide-react';
import { openPlanCheckout } from '../lib/razorpay';
import {
  getActivePlans,
  hasPurchaseAccess,
  hasPurchasedPlan,
  getCredits,
  getPurchases,
  type Plan,
} from '../lib/plans';
import { useUser } from '@clerk/clerk-react';

const FREE_FEATURES = [
  '3 free site credits',
  'All 15 templates',
  'AI-generated content',
  'Design edits & version history',
  'Responsive preview',
];

function currency(price: number): string {
  return `₹${price}`;
}

export default function Pricing() {
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState('');
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const plans = getActivePlans();
  const credits = getCredits();
  const purchases = getPurchases();
  const purchased = hasPurchaseAccess();

  async function handleBuy(plan: Plan) {
    if (processingId) return;
    if (!isSignedIn) {
      navigate('/');
      return;
    }
    setProcessingId(plan.id);
    setError('');
    try {
      await openPlanCheckout({
        plan,
        prefill: {
          name: user?.fullName || user?.primaryEmailAddress?.emailAddress || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
        themeColor: '#111111',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setProcessingId(null);
    }
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-[var(--app-border)] bg-white px-4 py-1.5 text-xs font-medium text-[var(--app-muted)]"
          >
            <Coins size={13} className="text-[#F79A1B]" />
            Credit-based pricing · {credits} credits currently on your account
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="text-4xl font-medium leading-tight tracking-tight sm:text-5xl"
            style={{ fontFamily: 'var(--font-editorial)' }}
          >
            One credit. One website.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mx-auto mt-4 max-w-lg text-base text-[var(--app-muted)]"
          >
            Every new site you generate uses one credit. Start with 3 free, then pick a pack that
            fits how fast you build. Purchases unlock export forever on your account.
          </motion.p>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-4">
          {/* Free plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex flex-col rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-8"
          >
            <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--app-muted)]">Free</h2>
            <div className="mt-4 flex items-end gap-1">
              <span className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                ₹0
              </span>
              <span className="mb-1 text-sm text-[var(--app-muted)]">+ 3 credits</span>
            </div>
            <p className="mt-3 text-sm text-[var(--app-muted)]">Great for trying the builder.</p>
            <ul className="mt-6 flex flex-col gap-3">
              {FREE_FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <Check size={15} className="mt-0.5 shrink-0 text-[var(--app-muted)]" strokeWidth={2} />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/" className="btn-secondary mt-8 w-full">
              Get started for free
            </Link>
          </motion.div>

          {/* Credit plans */}
          {plans.map((plan, i) => {
            const alreadyOwned = hasPurchasedPlan(plan.id);
            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                className={`relative flex flex-col rounded-2xl border-2 p-8 ${
                  plan.popular
                    ? 'border-black bg-[var(--app-fg)] text-[var(--app-bg)] shadow-[0_16px_48px_rgba(0,0,0,0.12)]'
                    : 'border-[var(--app-border)] bg-[var(--app-surface)]'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-8 rounded-full bg-[#F79A1B] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-black">
                    Popular
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <h2 className="text-sm font-semibold uppercase tracking-wider opacity-70">{plan.name}</h2>
                  {alreadyOwned && (
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${
                        plan.popular
                          ? 'bg-[var(--app-bg)] text-[var(--app-fg)]'
                          : 'bg-emerald-100 text-emerald-700'
                      }`}
                    >
                      <BadgeCheck size={12} />
                      Owned
                    </span>
                  )}
                </div>
                <div className="mt-4 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
                    {currency(plan.price)}
                  </span>
                  <span className="mb-1 text-sm opacity-70">one-time</span>
                </div>
                <div className="mt-1 text-sm font-semibold opacity-80">
                  {plan.credits} credits
                </div>
                <p className={`mt-3 text-sm ${plan.popular ? 'opacity-80' : 'text-[var(--app-muted)]'}`}>
                  {plan.tagline}
                </p>
                <ul className="mt-6 flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check
                        size={15}
                        className={`mt-0.5 shrink-0 ${plan.popular ? 'text-[#F79A1B]' : 'text-[var(--app-muted)]'}`}
                        strokeWidth={2}
                      />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleBuy(plan)}
                  disabled={(processingId !== null && processingId !== plan.id) || alreadyOwned}
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40 ${
                    plan.popular
                      ? 'bg-[var(--app-bg)] text-[var(--app-fg)]'
                      : 'bg-[var(--app-fg)] text-[var(--app-bg)]'
                  }`}
                >
                  {alreadyOwned ? (
                    <>
                      <BadgeCheck size={14} />
                      Plan purchased
                    </>
                  ) : processingId === plan.id ? (
                    'Opening checkout…'
                  ) : (
                    <>
                      <Zap size={14} />
                      Buy {plan.name}
                    </>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>

        {!isSignedIn && (
          <p className="mt-4 text-center text-xs text-[var(--app-muted)]">
            <Link to="/" className="underline underline-offset-2">
              Sign in
            </Link>{' '}
            with Clerk to purchase a plan.
          </p>
        )}
        {error && <p className="mt-4 text-center text-xs font-medium text-red-500">{error}</p>}

        <div className="mt-14 grid gap-4 text-center sm:grid-cols-3">
          {[
            { icon: Coins, title: 'Credit packs', text: 'Buy once per pack — no subscription. Each site generation uses one credit.' },
            { icon: BadgeCheck, title: 'Export unlocked', text: 'Any purchase unlocks full site export on your account, forever.' },
            { icon: ShieldCheck, title: 'Secure payments', text: 'Checkout powered by Razorpay — UPI, cards & netbanking.' },
          ].map(({ icon: Icon, title, text }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="flex flex-col items-center gap-2 rounded-xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6"
            >
              <Icon size={20} className="text-[var(--app-fg)]" strokeWidth={1.5} />
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-[var(--app-muted)]">{text}</div>
            </motion.div>
          ))}
        </div>

        {purchased && (
          <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="text-sm font-semibold">Your purchases</div>
              <Link to="/projects" className="text-xs font-medium text-[var(--app-muted)] underline underline-offset-2">
                Continue building →
              </Link>
            </div>
            <ul className="flex flex-col gap-2">
              {purchases.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3 rounded-lg bg-[var(--app-surface-hover)] px-4 py-2.5 text-sm">
                  <span className="flex items-center gap-2">
                    <BadgeCheck size={14} className="text-emerald-600" />
                    {p.name}
                  </span>
                  <span className="text-xs text-[var(--app-muted)]">
                    {p.credits > 0 ? `+${p.credits} credits · ` : ''}
                    {new Date(p.date).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--app-fg)] px-4 py-2.5 text-sm text-[var(--app-bg)]">
              <Sparkles size={14} className="text-[#F79A1B]" />
              Credits remaining: <span className="font-semibold">{credits}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}