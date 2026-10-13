import type { Project } from '../types';

/**
 * Fire-and-forget sync of projects/purchases to the server (MongoDB when
 * configured, in-memory otherwise). localStorage stays the fast source of
 * truth; the server acts as durable storage so projects survive device change
 * and can power a real deployment.
 */

let currentUserId = '';

export function setSyncUser(userId: string | null): void {
  currentUserId = userId ?? '';
}

export function hasSyncUser(): boolean {
  return Boolean(currentUserId);
}

export function getSyncUser(): string {
  return currentUserId;
}

async function fetchWithTimeout(input: string, init: RequestInit, ms = 8000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(input, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

export async function pushProject(project: Project): Promise<boolean> {
  if (!currentUserId) return false;
  try {
    const res = await fetchWithTimeout(
      `/api/projects`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...project, userId: currentUserId }),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}

export async function removeProjectRemote(id: string): Promise<boolean> {
  if (!currentUserId) return false;
  try {
    const res = await fetchWithTimeout(`/api/projects/${encodeURIComponent(id)}`, { method: 'DELETE' });
    return res.ok;
  } catch {
    return false;
  }
}

export async function fetchRemoteProject(id: string): Promise<Project | null> {
  try {
    const res = await fetchWithTimeout(`/api/projects/${encodeURIComponent(id)}`, {});
    if (!res.ok) return null;
    const data = await res.json();
    if (!data?.id || !data?.config) return null;
    return data as Project;
  } catch {
    return null;
  }
}

export async function fetchRemoteProjects(): Promise<Project[]> {
  if (!currentUserId) return [];
  try {
    const res = await fetchWithTimeout(`/api/projects?userId=${encodeURIComponent(currentUserId)}`, {});
    if (!res.ok) return [];
    const data = (await res.json()) as { items?: Project[] };
    return Array.isArray(data.items) ? data.items : [];
  } catch {
    return [];
  }
}

export interface RemotePurchaseInput {
  id: string;
  planId: string;
  name: string;
  price: number;
  credits: number;
  exportAccess: boolean;
  paymentId?: string;
}

export async function pushPurchase(input: RemotePurchaseInput): Promise<void> {
  if (!currentUserId) return;
  try {
    await fetchWithTimeout(
      '/api/purchases',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...input, userId: currentUserId, createdAt: Date.now() }),
      },
      4000
    );
  } catch {
    // non-fatal: purchase stays in localStorage
  }
}

// ---------------------------------------------------------------------------
// User state hydration (credits + purchases) — called once on sign-in
// ---------------------------------------------------------------------------

/**
 * A purchase record as returned by GET /api/me.
 * `createdAt` maps to the `date` field in the local PurchaseRecord type.
 */
export interface ServerPurchase {
  id: string;
  planId: string;
  name: string;
  price: number;
  credits: number;
  exportAccess: boolean;
  createdAt: number;
  paymentId?: string;
}

export interface UserState {
  /** Server-computed credit balance (FREE_START_CREDITS + purchased − spent). */
  credits: number;
  purchases: ServerPurchase[];
}

/**
 * Fetches the user's credit balance and purchase history from the server.
 * Called once when the user signs in so localStorage is hydrated with the
 * correct balance for this account — not just whatever was on this device.
 */
export async function fetchUserState(userId: string): Promise<UserState | null> {
  try {
    const res = await fetchWithTimeout(
      `/api/me?userId=${encodeURIComponent(userId)}`,
      {},
      6000
    );
    if (!res.ok) return null;
    return (await res.json()) as UserState;
  } catch {
    return null;
  }
}

/**
 * Fire-and-forget: tells the server a credit was spent so the balance stays
 * accurate across devices. Non-fatal — the spend is already deducted locally.
 */
export async function pushCreditSpend(amount: number): Promise<void> {
  if (!currentUserId) return;
  try {
    await fetchWithTimeout(
      '/api/me/spend',
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: currentUserId, amount }),
      },
      4000
    );
  } catch {
    // non-fatal: spend is still tracked locally
  }
}