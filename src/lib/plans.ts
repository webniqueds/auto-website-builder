export interface Plan {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  currency: string;
  credits: number;
  features: string[];
  exportAccess: boolean;
  popular?: boolean;
  active: boolean;
}

export interface PurchaseRecord {
  id: string;
  planId: string;
  name: string;
  price: number;
  credits: number;
  date: number;
  exportAccess: boolean;
}

export const FREE_START_CREDITS = 3;

const PLANS_KEY = 'website-builder-plans';
const CREDITS_KEY = 'website-builder-credits';
const PURCHASES_KEY = 'website-builder-purchases';

import { pushPurchase, pushCreditSpend } from './serverSync';

export const DEFAULT_PLANS: Plan[] = [
  {
    id: 'seed',
    name: 'Seed',
    tagline: 'For getting your first site live.',
    description: 'A starter pack of credits to try serious building.',
    price: 99,
    currency: 'INR',
    credits: 15,
    features: [
      '15 site credits',
      'Full site export',
      'All 15 templates',
      'AI editing & version history',
    ],
    exportAccess: true,
    active: true,
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Best value for active builders.',
    description: 'Enough credits to build and iterate all month.',
    price: 249,
    currency: 'INR',
    credits: 60,
    features: [
      '60 site credits',
      'Full site export',
      'All 15 templates',
      'Priority generation',
    ],
    exportAccess: true,
    popular: true,
    active: true,
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For agencies & power users.',
    description: 'A big block of credits for building client sites.',
    price: 499,
    currency: 'INR',
    credits: 200,
    features: [
      '200 site credits',
      'Full site export',
      'All 15 templates',
      'Priority generation',
      'Onboarding help',
    ],
    exportAccess: true,
    active: true,
  },
];

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable
  }
}

export function getPlans(): Plan[] {
  const stored = readJSON<Plan[] | null>(PLANS_KEY, null);
  if (stored && Array.isArray(stored) && stored.length > 0) return stored;
  savePlans(DEFAULT_PLANS);
  return DEFAULT_PLANS;
}

export function getActivePlans(): Plan[] {
  return getPlans().filter((p) => p.active);
}

export function savePlans(plans: Plan[]): void {
  writeJSON(PLANS_KEY, plans);
}

export function resetPlans(): void {
  savePlans(DEFAULT_PLANS);
}

export function getPlan(id: string): Plan | undefined {
  return getPlans().find((p) => p.id === id);
}

export function upsertPlan(plan: Plan): void {
  const plans = getPlans();
  const idx = plans.findIndex((p) => p.id === plan.id);
  if (idx >= 0) plans[idx] = plan;
  else plans.push(plan);
  savePlans(plans);
}

export function deletePlan(id: string): void {
  savePlans(getPlans().filter((p) => p.id !== id));
}

/**
 * Pulls the server-persisted plan list (the admin's edits) into this device.
 * LocalStorage stays the source of truth when the server is unreachable.
 */
export async function syncPlansFromServer(): Promise<boolean> {
  try {
    const res = await fetch('/api/plans');
    if (!res.ok) return false;
    const data = (await res.json()) as { items?: Plan[] };
    if (Array.isArray(data.items) && data.items.length > 0) {
      savePlans(data.items);
      return true;
    }
  } catch {
    // offline / server not running — keep local plans
  }
  return false;
}

export function generatePlanId(): string {
  return 'plan-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function migrateLegacyPro(): PurchaseRecord[] {
  const purchases = readJSON<PurchaseRecord[]>(PURCHASES_KEY, []);
  const legacy = (() => {
    try {
      return localStorage.getItem('website-builder-pro') === '1';
    } catch {
      return false;
    }
  })();
  if (legacy && !purchases.some((p) => p.planId === 'legacy-pro')) {
    purchases.unshift({
      id: 'legacy-pro',
      planId: 'legacy-pro',
      name: 'Pro (legacy)',
      price: 499,
      credits: 0,
      date: Date.now(),
      exportAccess: true,
    });
    writeJSON(PURCHASES_KEY, purchases);
  }
  return purchases;
}

export function getPurchases(): PurchaseRecord[] {
  return migrateLegacyPro();
}

export function recordPurchase(plan: Plan): PurchaseRecord {
  const record: PurchaseRecord = {
    id: Math.random().toString(36).substring(2, 10) + Date.now().toString(36),
    planId: plan.id,
    name: plan.name,
    price: plan.price,
    credits: plan.credits,
    date: Date.now(),
    exportAccess: plan.exportAccess,
  };
  const purchases = getPurchases();
  purchases.unshift(record);
  writeJSON(PURCHASES_KEY, purchases);
  void pushPurchase({
    id: record.id,
    planId: record.planId,
    name: record.name,
    price: record.price,
    credits: record.credits,
    exportAccess: record.exportAccess,
  });
  return record;
}

export function hasPurchaseAccess(): boolean {
  return getPurchases().length > 0;
}

/**
 * Paid plans (Growth/Scale) advertise "Priority generation" in their features.
 * Returns true when the user has purchased a plan that lists it.
 */
export function hasPriorityGeneration(): boolean {
  return getPurchases().some((p) => {
    if (p.planId === 'growth' || p.planId === 'scale') return true;
    const plan = getPlan(p.planId);
    return Boolean(plan?.features.some((f) => /priority generation/i.test(f)));
  });
}

export function hasPurchasedPlan(planId: string): boolean {
  return getPurchases().some((p) => p.planId === planId);
}

export function getCredits(): number {
  ensureInitialCredits();
  try {
    return Number(localStorage.getItem(CREDITS_KEY) || 0);
  } catch {
    return 0;
  }
}

export function setCredits(value: number): void {
  try {
    // Store up to one decimal place so half-credits (AI edits) survive
    // a round-trip through localStorage without being floored to 0.
    const rounded = Math.round(Math.max(0, value) * 10) / 10;
    localStorage.setItem(CREDITS_KEY, String(rounded));
  } catch {
    // storage unavailable
  }
}

export function addCredits(value: number): number {
  const next = getCredits() + value;
  setCredits(next);
  return next;
}

export function ensureInitialCredits(): boolean {
  try {
    if (localStorage.getItem(CREDITS_KEY) === null) {
      setCredits(FREE_START_CREDITS);
      return true;
    }
  } catch {
    // storage unavailable
  }
  return false;
}

/** Deducts 1 credit (used for a full new generation or a regeneration). */
export function spendCredit(): number {
  ensureInitialCredits();
  const current = getCredits();
  if (current <= 0) return 0;
  const next = current - 1;
  setCredits(next);
  // Fire-and-forget: tell the server so the balance is correct on other devices.
  void pushCreditSpend(1);
  return next;
}

/**
 * Deducts 0.5 credits (used for an AI edit command in the Preview editor).
 * Returns the new balance, or 0 if the user was already at zero.
 */
export function spendHalfCredit(): number {
  ensureInitialCredits();
  const current = getCredits();
  if (current <= 0) return 0;
  const next = Math.max(0, current - 0.5);
  setCredits(next);
  // Fire-and-forget: tell the server so the balance is correct on other devices.
  void pushCreditSpend(0.5);
  return next;
}

/**
 * Merges purchases fetched from the server into local storage.
 * Called on sign-in to restore purchases made on other devices.
 * Uses the purchase `id` as the dedup key — never overwrites a local record
 * with the same id (local is treated as equally up-to-date).
 */
export function mergeRemotePurchases(
  remote: {
    id: string;
    planId: string;
    name: string;
    price: number;
    credits: number;
    exportAccess: boolean;
    createdAt: number;
  }[]
): void {
  if (!Array.isArray(remote) || remote.length === 0) return;
  const existing = getPurchases();
  const byId = new Map(existing.map((p) => [p.id, p]));
  let changed = false;
  for (const r of remote) {
    if (!r?.id || byId.has(r.id)) continue; // already in local store
    byId.set(r.id, {
      id: r.id,
      planId: r.planId,
      name: r.name,
      price: r.price,
      credits: r.credits,
      date: r.createdAt,   // server uses createdAt; local uses date
      exportAccess: r.exportAccess,
    });
    changed = true;
  }
  if (changed) {
    writeJSON(PURCHASES_KEY, [...byId.values()].sort((a, b) => b.date - a.date));
  }
}