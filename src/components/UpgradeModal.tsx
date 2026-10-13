import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Check, Info, LogIn, Coins } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { openPlanCheckout } from '../lib/razorpay';
import { getActivePlans, getCredits, type Plan } from '../lib/plans';

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  reason?: string;
}

export default function UpgradeModal({ open, onClose, onSuccess, reason }: UpgradeModalProps) {
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const plans = getActivePlans();
  const [selectedId, setSelectedId] = useState<string | null>(
    plans.find((p) => p.popular)?.id ?? plans[0]?.id ?? null
  );
  const selected = plans.find((p) => p.id === selectedId) ?? plans[0];

  async function handleUpgrade() {
    if (processing || !selected) return;
    if (!isSignedIn) {
      navigate('/pricing');
      return;
    }
    setProcessing(true);
    setError('');
    try {
      await openPlanCheckout({
        plan: selected,
        prefill: {
          name: user?.fullName || user?.primaryEmailAddress?.emailAddress || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        },
      });
      onSuccess?.();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-2xl bg-[var(--app-surface)] p-7 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4 flex items-start justify-between">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#F79A1B]/15 text-[#B45309]">
                <Coins size={20} />
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)]"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <h2
              className="mb-1 text-xl font-semibold tracking-tight"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              Add credits
            </h2>
            <p className="mb-5 text-sm text-[var(--app-muted)]">
              {reason === 'export'
                ? 'Full site export unlocks on any paid plan.'
                : 'You are out of credits. Buy a pack to keep building — each new site uses one credit.'}
            </p>

            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--app-muted)]">
              Choose a plan
            </p>
            <div className="flex flex-col gap-2">
              {plans.map((plan: Plan) => {
                const isSelected = selected?.id === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedId(plan.id)}
                    className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition-colors ${
                      isSelected
                        ? 'border-black bg-[var(--app-fg)] text-[var(--app-bg)]'
                        : 'border-[var(--app-border)] hover:bg-[var(--app-surface-hover)]'
                    }`}
                  >
                    <span>
                      <span className="flex items-center gap-1.5 text-sm font-semibold">
                        {plan.name}
                        {plan.popular && (
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                              isSelected ? 'bg-[#F79A1B] text-black' : 'bg-[#F79A1B]/15 text-[#B45309]'
                            }`}
                          >
                            Popular
                          </span>
                        )}
                      </span>
                      <span className={`mt-0.5 block text-xs ${isSelected ? 'opacity-70' : 'text-[var(--app-muted)]'}`}>
                        {plan.credits} credits
                      </span>
                    </span>
                    <span className="flex items-center gap-2 text-sm font-semibold">
                      ₹{plan.price}
                      {isSelected && <Check size={15} />}
                    </span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={handleUpgrade}
              disabled={processing || !selected}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-[var(--app-fg)] px-6 py-3 text-sm font-semibold text-[var(--app-bg)] transition-transform hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Sparkles size={14} />
              {processing
                ? 'Opening checkout…'
                : `Buy ${selected?.name ?? ''} for ₹${selected?.price ?? ''}`}
            </button>

            {!isSignedIn && (
              <button
                onClick={() => navigate('/pricing')}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full border border-[var(--app-border)] px-6 py-3 text-sm font-medium transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                <LogIn size={14} />
                Sign in to purchase
              </button>
            )}

            <p className="mt-4 flex items-center gap-1.5 text-xs text-[var(--app-muted)]">
              <Info size={13} />
              Credits remaining on your account: {getCredits()}
            </p>

            {error && <p className="mt-3 text-center text-xs font-medium text-red-500">{error}</p>}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}