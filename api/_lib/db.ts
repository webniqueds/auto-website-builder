import dns from 'dns';
import { MongoClient, type Collection, type Db, type Filter, type UpdateFilter } from 'mongodb';

// Ensure Node uses Google/Cloudflare public DNS for MongoDB SRV record resolution on Windows/ISP networks
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch {
  // Ignore if restricted in sandbox
}

/**
 * Thin MongoDB helper with an in-memory fallback so the app works even when
 * MONGODB_URI is not configured (local dev without a database running) OR the
 * configured database is unreachable. If a Mongo operation fails, we switch
 * to the memory store for the rest of the process instead of silently
 * dropping data.
 *
 * On Vercel (serverless) each invocation gets a fresh module scope, so the
 * connection is cached per cold start via the module-level promise.
 */

export interface StoredProject {
  _id?: string;
  id: string;
  userId: string;
  name: string;
  templateId: string;
  niche: string;
  palette: unknown;
  config: unknown;
  createdAt: number;
  updatedAt: number;
}

export interface StoredPurchase {
  _id?: string;
  id: string;
  userId: string;
  planId: string;
  name: string;
  price: number;
  credits: number;
  paymentId?: string;
  exportAccess: boolean;
  createdAt: number;
}

export interface StoredPlan {
  _id?: string;
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
  updatedAt: number;
}

/**
 * Per-user record that tracks how many credits the user has spent in total.
 * Combined with their purchase history, this lets us compute the real credit
 * balance on any device: balance = FREE_START_CREDITS + totalPurchased − creditsSpent.
 */
export interface StoredUser {
  _id?: string;
  userId: string;
  creditsSpent: number;  // float — supports 0.5-credit AI-edit deductions
  updatedAt: number;
}

const MONGODB_URI = process.env.MONGODB_URI || '';
const DB_NAME = process.env.MONGODB_DB || 'Website';

let clientPromise: Promise<MongoClient> | null = null;

// Start in memory mode only when no URI is configured. Otherwise we try Mongo
// and fall back to memory on the first failure.
let memoryFallback = !MONGODB_URI;

function connect(): Promise<MongoClient> {
  if (!MONGODB_URI || memoryFallback) {
    return Promise.reject(new Error('MongoDB not configured'));
  }
  if (!clientPromise) {
    clientPromise = new MongoClient(MONGODB_URI, {
      serverSelectionTimeoutMS: 4000,
    })
      .connect()
      .catch((err) => {
        clientPromise = null;
        throw err;
      });
  }
  return clientPromise;
}

export function isDbConfigured(): boolean {
  return Boolean(MONGODB_URI);
}

async function getCollections(): Promise<{
  db: Db;
  projects: Collection<StoredProject>;
  purchases: Collection<StoredPurchase>;
  plans: Collection<StoredPlan>;
  users: Collection<StoredUser>;
}> {
  const client = await connect();
  const db = client.db(DB_NAME);
  return {
    db,
    projects: db.collection<StoredProject>('projects'),
    purchases: db.collection<StoredPurchase>('purchases'),
    plans: db.collection<StoredPlan>('plans'),
    users: db.collection<StoredUser>('users'),
  };
}

/**
 * Runs a Mongo-backed operation; on any failure it switches the process to
 * the in-memory store (so a missing/unreachable database can't lose data)
 * and falls through to the provided memory implementation.
 */
async function withFallback<T>(
  mongoOp: () => Promise<T>,
  memoryOp: () => T | Promise<T>
): Promise<T> {
  if (memoryFallback) return memoryOp();
  try {
    return await mongoOp();
  } catch (err) {
    console.warn('[db] Mongo op failed, switching to in-memory store:', (err as Error).message);
    memoryFallback = true;
    return memoryOp();
  }
}

// ---------------------------------------------------------------------------
// In-memory fallback store
// ---------------------------------------------------------------------------
interface MemoryStore {
  projects: Map<string, StoredProject>;
  purchases: Map<string, StoredPurchase>;
  plans: Map<string, StoredPlan>;
  users: Map<string, StoredUser>;
}

const store: MemoryStore = { projects: new Map(), purchases: new Map(), plans: new Map(), users: new Map() };

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export async function listProjects(userId: string): Promise<StoredProject[]> {
  return withFallback(
    async () => {
      const { projects } = await getCollections();
      return projects.find({ userId } as Filter<StoredProject>).sort({ updatedAt: -1 }).toArray();
    },
    () =>
      [...store.projects.values()]
        .filter((p) => p.userId === userId)
        .sort((a, b) => b.updatedAt - a.updatedAt)
  );
}

export async function getProjectById(id: string): Promise<StoredProject | null> {
  return withFallback(
    async () => {
      const { projects } = await getCollections();
      return await projects.findOne({ id } as Filter<StoredProject>);
    },
    () => store.projects.get(id) ?? null
  );
}

export async function saveProject(doc: StoredProject): Promise<StoredProject> {
  await withFallback(
    async () => {
      const { projects } = await getCollections();
      await projects.updateOne({ id: doc.id } as Filter<StoredProject>, { $set: doc }, { upsert: true });
    },
    () => {
      store.projects.set(doc.id, { ...doc });
    }
  );
  return doc;
}

export async function deleteProjectRecord(id: string): Promise<void> {
  await withFallback(
    async () => {
      const { projects } = await getCollections();
      await projects.deleteOne({ id } as Filter<StoredProject>);
    },
    () => {
      store.projects.delete(id);
    }
  );
}

// ---------------------------------------------------------------------------
// Purchases
// ---------------------------------------------------------------------------

export async function listPurchases(userId: string): Promise<StoredPurchase[]> {
  return withFallback(
    async () => {
      const { purchases } = await getCollections();
      return purchases.find({ userId } as Filter<StoredPurchase>).sort({ createdAt: -1 }).toArray();
    },
    () =>
      [...store.purchases.values()]
        .filter((p) => p.userId === userId)
        .sort((a, b) => b.createdAt - a.createdAt)
  );
}

export async function savePurchase(doc: StoredPurchase): Promise<StoredPurchase> {
  await withFallback(
    async () => {
      const { purchases } = await getCollections();
      await purchases.updateOne({ id: doc.id } as Filter<StoredPurchase>, { $set: doc }, { upsert: true });
    },
    () => {
      store.purchases.set(doc.id, { ...doc });
    }
  );
  return doc;
}

// ---------------------------------------------------------------------------
// Plans (server-persisted so admin edits reach every device)
// ---------------------------------------------------------------------------

export async function listPlans(): Promise<StoredPlan[]> {
  return withFallback(
    async () => {
      const { plans } = await getCollections();
      return plans.find({}).sort({ price: 1 }).toArray();
    },
    () => [...store.plans.values()].sort((a, b) => a.price - b.price)
  );
}

export async function savePlanRecord(plan: StoredPlan): Promise<void> {
  await withFallback(
    async () => {
      const { plans } = await getCollections();
      await plans.updateOne({ id: plan.id } as Filter<StoredPlan>, { $set: plan }, { upsert: true });
    },
    () => {
      store.plans.set(plan.id, { ...plan });
    }
  );
}

export async function deletePlanRecord(id: string): Promise<void> {
  await withFallback(
    async () => {
      const { plans } = await getCollections();
      await plans.deleteOne({ id } as Filter<StoredPlan>);
    },
    () => {
      store.plans.delete(id);
    }
  );
}

export async function replaceAllPlans(plans: StoredPlan[]): Promise<void> {
  await withFallback(
    async () => {
      const { plans: col } = await getCollections();
      await col.deleteMany({});
      if (plans.length > 0) await col.insertMany(plans);
    },
    () => {
      store.plans.clear();
      for (const p of plans) store.plans.set(p.id, { ...p });
    }
  );
}

// ---------------------------------------------------------------------------
// Admin aggregates
// ---------------------------------------------------------------------------

export async function countAllProjects(): Promise<number> {
  return withFallback(
    async () => {
      const { projects } = await getCollections();
      return projects.countDocuments({});
    },
    () => store.projects.size
  );
}

/** All purchases across every user (used for the admin dashboard). */
export async function listAllPurchases(): Promise<StoredPurchase[]> {
  return withFallback(
    async () => {
      const { purchases } = await getCollections();
      return purchases.find({}).toArray();
    },
    () => [...store.purchases.values()]
  );
}

// ---------------------------------------------------------------------------
// Users (per-user credit spend tracking)
// ---------------------------------------------------------------------------

/** Fetches the user's spend-tracking document, or null if it doesn't exist yet. */
export async function getUser(userId: string): Promise<StoredUser | null> {
  return withFallback(
    async () => {
      const { users } = await getCollections();
      return users.findOne({ userId } as Filter<StoredUser>);
    },
    () => store.users.get(userId) ?? null
  );
}

/**
 * Atomically increments the total credits spent for a user.
 * Creates the document on first spend (upsert). Uses $inc so concurrent
 * serverless invocations never lose an increment.
 */
export async function incrementCreditsSpent(userId: string, amount: number): Promise<void> {
  const now = Date.now();
  await withFallback(
    async () => {
      const { users } = await getCollections();
      await users.updateOne(
        { userId } as Filter<StoredUser>,
        {
          $inc: { creditsSpent: amount },
          $set: { updatedAt: now },
          $setOnInsert: { userId },
        } as UpdateFilter<StoredUser>,
        { upsert: true }
      );
    },
    () => {
      const existing = store.users.get(userId);
      store.users.set(userId, {
        userId,
        creditsSpent: (existing?.creditsSpent ?? 0) + amount,
        updatedAt: now,
      });
    }
  );
}