import type { VercelRequest } from '@vercel/node';
import { createPublicKey, createVerify, type JsonWebKey } from 'crypto';

/**
 * Server-side Clerk session-token verification.
 *
 * Clerk signs the user in on the client. The API verifies the session token
 * the client sends as `Authorization: Bearer <token>` so a request can be
 * attributed to a real, signed-in user instead of trusting a raw userId from
 * the request body.
 *
 * When no token is present, helpers return null and callers fall back to their
 * previous behaviour (local development / legacy clients).
 */

interface ClerkJwtPayload {
  sub?: string;
  sid?: string;
  iss?: string;
  exp?: number;
  nbf?: number;
  [key: string]: unknown;
}

interface JwksKey extends JsonWebKey {
  kid?: string;
}

const PUBLISHABLE_KEY =
  process.env.CLERK_PUBLISHABLE_KEY || process.env.VITE_CLERK_PUBLISHABLE_KEY || '';
const SECRET_KEY = process.env.CLERK_SECRET_KEY || '';

/**
 * Extracts the Frontend API host from a Clerk publishable key.
 * `pk_test_<base64(host$)>` → `<host>`.
 */
function frontendApiFromPublishableKey(key: string): string | null {
  if (!key) return null;
  const match = /^pk_(?:test|live)_(.+)$/.exec(key);
  if (!match) return null;
  try {
    const decoded = Buffer.from(match[1], 'base64').toString('utf8').replace(/\$$/, '').trim();
    return decoded || null;
  } catch {
    return null;
  }
}

const FRONTEND_API = frontendApiFromPublishableKey(PUBLISHABLE_KEY);

let jwksCache: { keys: JwksKey[] } | null = null;
let jwksFetchedAt = 0;
const JWKS_TTL_MS = 60 * 60 * 1000;

async function getJwks(): Promise<{ keys: JwksKey[] } | null> {
  if (!FRONTEND_API) return null;
  const now = Date.now();
  if (jwksCache && now - jwksFetchedAt < JWKS_TTL_MS) return jwksCache;
  try {
    const res = await fetch(`https://${FRONTEND_API}/.well-known/jwks.json`);
    if (!res.ok) return jwksCache;
    const data = (await res.json()) as { keys?: JwksKey[] };
    if (Array.isArray(data.keys)) {
      jwksCache = { keys: data.keys };
      jwksFetchedAt = now;
    }
    return jwksCache;
  } catch {
    return jwksCache;
  }
}

function base64UrlToBuffer(input: string): Buffer {
  const pad = input.length % 4 === 0 ? '' : '='.repeat(4 - (input.length % 4));
  return Buffer.from(input.replace(/-/g, '+').replace(/_/g, '/') + pad, 'base64');
}

export function getBearerToken(req: VercelRequest): string {
  const header = req.headers['authorization'];
  const value = Array.isArray(header) ? header[0] : header ?? '';
  const match = /^Bearer\s+(.+)$/i.exec(String(value).trim());
  return match ? match[1].trim() : '';
}

/** Verifies a Clerk session token and returns its payload, or null. */
export async function verifyClerkToken(token: string): Promise<ClerkJwtPayload | null> {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  let header: { alg?: string; kid?: string };
  let payload: ClerkJwtPayload;
  try {
    header = JSON.parse(base64UrlToBuffer(parts[0]).toString('utf8')) as typeof header;
    payload = JSON.parse(base64UrlToBuffer(parts[1]).toString('utf8')) as ClerkJwtPayload;
  } catch {
    return null;
  }

  if (header.alg !== 'RS256') return null;

  const nowSec = Math.floor(Date.now() / 1000);
  if (typeof payload.exp === 'number' && payload.exp < nowSec) return null;
  if (typeof payload.nbf === 'number' && payload.nbf > nowSec + 5) return null;

  const jwks = await getJwks();
  if (!jwks) return null;
  const jwk = jwks.keys.find((k) => k.kid === header.kid);
  if (!jwk) return null;

  try {
    const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
    const signature = base64UrlToBuffer(parts[2]);
    const verifier = createVerify('RSA-SHA256');
    verifier.update(`${parts[0]}.${parts[1]}`);
    verifier.end();
    return verifier.verify(publicKey, signature) ? payload : null;
  } catch {
    return null;
  }
}

/** Returns the verified Clerk user id for a request, or null. */
export async function getVerifiedUserId(req: VercelRequest): Promise<string | null> {
  if (!FRONTEND_API) return null;
  const payload = await verifyClerkToken(getBearerToken(req));
  return payload?.sub ?? null;
}

const emailCache = new Map<string, { email: string; at: number }>();
const EMAIL_TTL_MS = 5 * 60 * 1000;

/**
 * Looks up a Clerk user's primary e-mail via the Backend API using the secret
 * key. Results are cached briefly so admin checks don't hit Clerk every call.
 */
export async function getClerkUserEmail(userId: string): Promise<string | null> {
  if (!SECRET_KEY || !userId) return null;
  const cached = emailCache.get(userId);
  if (cached && Date.now() - cached.at < EMAIL_TTL_MS) return cached.email;
  try {
    const res = await fetch(`https://api.clerk.com/v1/users/${encodeURIComponent(userId)}`, {
      headers: { Authorization: `Bearer ${SECRET_KEY}` },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as {
      primary_email_address_id?: string;
      email_addresses?: { id: string; email_address: string }[];
    };
    const primary =
      data.email_addresses?.find((e) => e.id === data.primary_email_address_id) ??
      data.email_addresses?.[0];
    const email = primary?.email_address?.toLowerCase() ?? null;
    if (email) emailCache.set(userId, { email, at: Date.now() });
    return email;
  } catch {
    return null;
  }
}

export function isClerkConfigured(): boolean {
  return Boolean(FRONTEND_API && SECRET_KEY);
}
