import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import {
  ArrowLeft,
  Coins,
  Plus,
  Trash2,
  Save,
  RefreshCcw,
  ShieldCheck,
  Loader2,
  Lock,
  Files,
  ShoppingBag,
  IndianRupee,
  Zap,
  Crown,
} from 'lucide-react';
import {
  getPlans,
  upsertPlan,
  deletePlan,
  resetPlans,
  savePlans,
  addCredits,
  getCredits,
  generatePlanId,
  type Plan,
} from '../lib/plans';
import { cn } from '../lib/utils';

const EMPTY_FORM = { name: '', price: '', credits: '', popular: false };

interface PlanSale {
  planId: string;
  name: string;
  count: number;
  credits: number;
  revenue: number;
}

interface RecentPurchase {
  id: string;
  planId: string;
  name: string;
  price: number;
  credits: number;
  createdAt: number;
}

interface AdminStats {
  projects: number;
  purchases: number;
  revenue: number;
  creditsSold: number;
  activePlans: number;
  byPlan: PlanSale[];
  recent: RecentPurchase[];
}

function fmt(n: number): string {
  return new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);
}

export default function Admin() {
  const { isSignedIn, user } = useUser();
  const [adminEmails, setAdminEmails] = useState<string[] | null>(null);
  const [plans, setPlans] = useState<Plan[]>(() => getPlans());
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [credits, setCredits] = useState(() => getCredits());
  const [form, setForm] = useState(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [grantAmount, setGrantAmount] = useState('');
  const [toast, setToast] = useState('');

  useEffect(() => {
    fetch('/api/admin-config')
      .then((r) => r.json())
      .then((data) => setAdminEmails(Array.isArray(data?.emails) ? data.emails : []))
      .catch(() => setAdminEmails([]));
  }, []);

  const email = user?.primaryEmailAddress?.emailAddress?.toLowerCase() ?? '';
  const isAdmin = useMemo(
    () => isSignedIn && adminEmails?.some((e) => e.toLowerCase() === email) === true,
    [isSignedIn, adminEmails, email]
  );

  /**
   * Thin wrapper around fetch that automatically attaches the x-admin-email
   * header so the server can verify the caller is a listed superadmin.
   */
  const emailRef = useRef(email);
  emailRef.current = email;
  const adminFetch = useCallback(
    (url: string, init?: RequestInit): Promise<Response> => {
      return fetch(url, {
        ...init,
        headers: {
          ...(init?.headers ?? {}),
          'x-admin-email': emailRef.current,
        },
      });
    },
    []
  );

  const loadPlans = useCallback(async () => {
    try {
      const res = await fetch('/api/plans');
      if (res.ok) {
        const data = (await res.json()) as { items?: Plan[] };
        if (Array.isArray(data.items) && data.items.length > 0) {
          savePlans(data.items);
          setPlans(data.items);
          return;
        }
      }
    } catch {
      // server unreachable — use local plans
    }
    setPlans(getPlans());
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin-stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data as AdminStats);
      }
    } catch {
      setStats(null);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (!isAdmin) return;
    void loadPlans();
    void loadStats();
  }, [isAdmin, loadPlans, loadStats]);

  function refresh() {
    setPlans(getPlans());
    setCredits(getCredits());
  }

  function notice(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(''), 2500);
  }

  async function persistPlan(p: Plan) {
    upsertPlan(p);
    try {
      await adminFetch('/api/plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      });
    } catch {
      // keep local edits even if server unreachable
    }
    setPlans(getPlans());
  }

  async function removePlan(p: Plan) {
    deletePlan(p.id);
    try {
      await adminFetch(`/api/plans?id=${encodeURIComponent(p.id)}`, { method: 'DELETE' });
    } catch {
      // local stayed updated
    }
    setPlans(getPlans());
    notice('Plan deleted.');
  }

  const startAdd = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  const startEdit = (p: Plan) => {
    setEditingId(p.id);
    setForm({ name: p.name, price: String(p.price), credits: String(p.credits), popular: Boolean(p.popular) });
  };

  const savePlan = async () => {
    const price = Number(form.price);
    const creditsNum = Number(form.credits);
    if (!form.name.trim() || !Number.isFinite(price) || price < 0 || !Number.isFinite(creditsNum) || creditsNum <= 0) {
      notice('Enter a valid name, price, and credit count.');
      return;
    }
    const existing = editingId ? plans.find((p) => p.id === editingId) : undefined;
    const plan: Plan = {
      id: editingId ?? generatePlanId(),
      name: form.name.trim(),
      tagline: existing?.tagline ?? `${form.credits} credits in one pack.`,
      description: existing?.description ?? 'Custom plan created by an admin.',
      price,
      currency: existing?.currency ?? 'INR',
      credits: Math.round(creditsNum),
      features: existing?.features ?? [`${form.credits} site credits`, 'Full site export', 'All 15 templates'],
      exportAccess: existing?.exportAccess ?? true,
      popular: form.popular,
      active: existing?.active ?? true,
    };
    await persistPlan(plan);
    setForm(EMPTY_FORM);
    setEditingId(null);
    notice('Plan saved.');
  };

  const toggleFlag = (p: Plan, patch: Partial<Plan>) => {
    void persistPlan({ ...p, ...patch });
  };

  const grantCredits = () => {
    const n = Number(grantAmount);
    if (!Number.isFinite(n) || n <= 0) {
      notice('Enter a positive number.');
      return;
    }
    addCredits(Math.round(n));
    refresh();
    setGrantAmount('');
    notice(`Added ${Math.round(n)} credits.`);
  };

  const doReset = async () => {
    if (window.confirm('Reset all plans to defaults and clear custom plans?')) {
      resetPlans();
      try {
        await adminFetch('/api/plans/reset', { method: 'POST' });
      } catch {
        // local restored already
      }
      refresh();
      notice('Plans reset to defaults.');
    }
  };

  if (adminEmails === null) {
    return (
      <div className="flex flex-col items-center justify-center px-6 py-24 text-[var(--app-muted)]">
        <Loader2 size={24} className="animate-spin" />
        <p className="mt-3 text-sm">Checking admin access…</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-surface-hover)]">
          <Lock size={18} className="text-[var(--app-muted)]" />
        </div>
        <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Sign in to view Admin
        </h1>
        <p className="mt-2 text-sm text-[var(--app-muted)]">
          This page is restricted to administrators.
        </p>
        <Link to="/pricing" className="mt-6 text-sm text-[var(--app-muted)] underline">
          Back to pricing
        </Link>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center px-6 py-24 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--app-surface-hover)]">
          <ShieldCheck size={18} className="text-[var(--app-muted)]" />
        </div>
        <h1 className="text-xl font-semibold" style={{ fontFamily: 'var(--font-display)' }}>
          Access denied
        </h1>
        <p className="mt-2 text-sm text-[var(--app-muted)]">
          Your account ({email || 'unknown'}) is not listed as an administrator.
        </p>
        <Link to="/" className="mt-6 text-sm text-[var(--app-muted)] underline">
          Back to templates
        </Link>
      </div>
    );
  }

  const cards = stats
    ? [
        { label: 'Projects built', value: fmt(stats.projects), icon: Files, tone: '#0EA5E9' },
        { label: 'Purchases', value: fmt(stats.purchases), icon: ShoppingBag, tone: '#F79A1B' },
        { label: 'Revenue', value: `₹${fmt(stats.revenue)}`, icon: IndianRupee, tone: '#10B981' },
        { label: 'Credits sold', value: fmt(stats.creditsSold), icon: Zap, tone: '#8B5CF6' },
        { label: 'Active plans', value: fmt(stats.activePlans), icon: Crown, tone: '#F43F5E' },
      ]
    : [];

  return (
    <div className="mx-auto max-w-5xl px-5 pb-20">
      <div className="mb-6 flex items-center gap-3">
        <Link
          to="/"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--app-border)] transition-colors hover:bg-[var(--app-surface-hover)]"
        >
          <ArrowLeft size={15} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
              Admin
            </h1>
            <span className="flex items-center gap-1 rounded-full bg-[#0EA5E9]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0369A1]">
              <ShieldCheck size={11} />
              Superadmin
            </span>
          </div>
          <p className="mt-0.5 text-sm text-[var(--app-muted)]">
            Signed in as <span className="font-medium text-[var(--app-fg)]">{email}</span>
          </p>
        </div>
      </div>

      {toast && (
        <p className="mb-4 rounded-lg bg-[#F79A1B]/10 px-4 py-2 text-xs font-medium text-[#B45309]">
          {toast}
        </p>
      )}

      {/* Dashboard */}
      <section className="mb-6">
        {stats === null ? (
          <div className="flex items-center gap-2 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] px-5 py-6 text-sm text-[var(--app-muted)]">
            <Loader2 size={14} className="animate-spin" />
            Loading dashboard…
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {cards.map((c) => (
                <div
                  key={c.label}
                  className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-4"
                >
                  <c.icon size={16} style={{ color: c.tone }} />
                  <div className="mt-2 text-xl font-bold tracking-tight">{c.value}</div>
                  <div className="text-[11px] font-medium text-[var(--app-muted)]">{c.label}</div>
                </div>
              ))}
            </div>

            <div className="mt-3 grid gap-3 lg:grid-cols-2">
              {stats.byPlan.length > 0 && (
                <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
                  <h2 className="mb-3 text-sm font-semibold">Sales by plan</h2>
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-[11px] uppercase tracking-wider text-[var(--app-muted)]">
                        <th className="pb-2 font-medium">Plan</th>
                        <th className="pb-2 font-medium">Count</th>
                        <th className="pb-2 font-medium">Credits</th>
                        <th className="pb-2 text-right font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stats.byPlan.map((p) => (
                        <tr key={p.planId} className="border-t border-[var(--app-border)]">
                          <td className="py-2 font-medium">{p.name}</td>
                          <td className="py-2 text-[var(--app-muted)]">{p.count}</td>
                          <td className="py-2 text-[var(--app-muted)]">{fmt(p.credits)}</td>
                          <td className="py-2 text-right font-medium">₹{fmt(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {stats.recent.length > 0 && (
                <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
                  <h2 className="mb-3 text-sm font-semibold">Recent purchases</h2>
                  <div className="space-y-1.5">
                    {stats.recent.map((r) => (
                      <div
                        key={r.id}
                        className="flex items-center justify-between rounded-lg px-2 py-1.5 text-sm odd:bg-[var(--app-surface-hover)]/50"
                      >
                        <div>
                          <span className="font-medium">{r.name}</span>
                          <span className="ml-2 text-xs text-[var(--app-muted)]">
                            {new Date(r.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="font-semibold">₹{fmt(r.price)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </section>

      {/* Grants */}
      <section className="mb-6 rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold">
          <Coins size={15} />
          This device's balance
        </h2>
        <div className="flex flex-wrap items-end gap-3">
          <div>
            <span className="block text-[11px] font-medium text-[var(--app-muted)]">Current credits</span>
            <span className="text-2xl font-bold">{credits}</span>
          </div>
          <div className="ml-auto flex items-end gap-2">
            <div>
              <label className="mb-1 block text-[11px] font-medium text-[var(--app-muted)]">
                Add credits
              </label>
              <input
                type="number"
                min="1"
                value={grantAmount}
                onChange={(e) => setGrantAmount(e.target.value)}
                className="w-28 rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--app-fg)]"
                placeholder="10"
              />
            </div>
            <button
              onClick={grantCredits}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-[var(--app-fg)] px-4 text-xs font-semibold text-[var(--app-bg)]"
            >
              <Plus size={13} />
              Add credits
            </button>
          </div>
        </div>
        <p className="mt-3 text-[11px] text-[var(--app-muted)]">
          Credits are stored per device. Grants applied here only affect this browser.
        </p>
      </section>

      {/* Plans */}
      <section className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-surface)] p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold">Credit plans</h2>
          <div className="flex gap-2">
            <button
              onClick={() => void doReset()}
              className="flex items-center gap-1.5 rounded-lg border border-[var(--app-border)] px-3 py-1.5 text-[11px] font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)]"
            >
              <RefreshCcw size={12} />
              Reset
            </button>
            <button
              onClick={startAdd}
              className="flex items-center gap-1.5 rounded-lg bg-[var(--app-fg)] px-3 py-1.5 text-[11px] font-semibold text-[var(--app-bg)]"
            >
              <Plus size={12} />
              Add plan
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {plans.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-[var(--app-border)] bg-[var(--app-bg)] px-4 py-3"
            >
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">{p.name}</span>
                  {p.popular && (
                    <span className="rounded-full bg-[#F79A1B]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-[#B45309]">
                      Popular
                    </span>
                  )}
                </div>
                <div className="mt-0.5 text-xs text-[var(--app-muted)]">
                  ₹{p.price} · {p.credits} credits · {p.active ? 'Active' : 'Hidden'}
                </div>
              </div>
              <button
                onClick={() => toggleFlag(p, { popular: !p.popular })}
                className={cn(
                  'rounded-full border px-3 py-1 text-[11px] font-medium transition-colors',
                  p.popular
                    ? 'border-[#F79A1B] text-[#B45309]'
                    : 'border-[var(--app-border)] text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)]'
                )}
              >
                Popular
              </button>
              <button
                onClick={() => toggleFlag(p, { active: !p.active })}
                className="rounded-full border border-[var(--app-border)] px-3 py-1 text-[11px] font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                {p.active ? 'Active' : 'Hidden'}
              </button>
              <button
                onClick={() => startEdit(p)}
                className="rounded-full border border-[var(--app-border)] px-3 py-1 text-[11px] font-medium text-[var(--app-muted)] transition-colors hover:bg-[var(--app-surface-hover)]"
              >
                Edit
              </button>
              <button
                onClick={() => void removePlan(p)}
                className="flex h-7 w-7 items-center justify-center rounded-full text-[var(--app-muted)] transition-colors hover:bg-red-50 hover:text-red-600"
                aria-label={`Delete ${p.name}`}
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>

        {/* Add / edit form */}
        {(editingId || form.name || form.price || form.credits !== '' || form.popular) && (
          <div className="mt-4 rounded-xl border border-[#F79A1B]/40 bg-[#F79A1B]/5 p-4">
            <div className="mb-3 text-xs font-semibold text-[#B45309]">
              {editingId ? 'Edit plan' : 'New plan'}
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <label className="col-span-2 sm:col-span-1">
                <span className="mb-1 block text-[11px] font-medium text-[var(--app-muted)]">Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Seed"
                  className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--app-fg)]"
                />
              </label>
              <label>
                <span className="mb-1 block text-[11px] font-medium text-[var(--app-muted)]">Price ₹</span>
                <input
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="99"
                  className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--app-fg)]"
                />
              </label>
              <label>
                <span className="mb-1 block text-[11px] font-medium text-[var(--app-muted)]">Credits</span>
                <input
                  type="number"
                  min="1"
                  value={form.credits}
                  onChange={(e) => setForm({ ...form, credits: e.target.value })}
                  placeholder="15"
                  className="w-full rounded-lg border border-[var(--app-border)] bg-[var(--app-bg)] px-3 py-2 text-sm outline-none focus:border-[var(--app-fg)]"
                />
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input
                  type="checkbox"
                  checked={form.popular}
                  onChange={(e) => setForm({ ...form, popular: e.target.checked })}
                  className="h-4 w-4 accent-[#F79A1B]"
                />
                <span className="text-xs font-medium text-[var(--app-muted)]">Mark popular</span>
              </label>
            </div>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => void savePlan()}
                className="flex items-center gap-1.5 rounded-lg bg-[var(--app-fg)] px-4 py-2 text-xs font-semibold text-[var(--app-bg)]"
              >
                <Save size={12} />
                {editingId ? 'Save changes' : 'Add plan'}
              </button>
              <button
                onClick={() => {
                  setForm(EMPTY_FORM);
                  setEditingId(null);
                }}
                className="rounded-lg px-4 py-2 text-xs font-medium text-[var(--app-muted)] hover:bg-[var(--app-surface-hover)]"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}