import type { VercelRequest } from '@vercel/node';
import { getClerkUserEmail, getVerifiedUserId } from './auth.js';

/**
 * Authorised superadmin e-mails, sourced from the SUPERADMIN_EMAILS env var.
 * Multiple addresses can be comma-separated:
 *   SUPERADMIN_EMAILS=alice@example.com,bob@example.com
 */
const SUPERADMIN_EMAILS: Set<string> = new Set(
  (process.env.SUPERADMIN_EMAILS || '')
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

/**
 * Returns true when the incoming request comes from a verified superadmin.
 *
 * Preferred path: the client sends a Clerk session token (`Authorization:
 * Bearer ...`); we verify it server-side and look up the user's primary e-mail
 * via the Clerk Backend API. A verified user is an admin only if their e-mail
 * is listed in SUPERADMIN_EMAILS — a valid session from someone else is denied.
 *
 * Legacy path: the frontend may send the e-mail in an `x-admin-email` header.
 * That is unverified, so it is only trusted when it matches the configured
 * list, and when no list is configured we only allow non-production (local
 * dev) requests.
 */
export async function isAdminRequest(req: VercelRequest): Promise<boolean> {
  // Nothing configured: allow only outside production (local dev mode).
  if (SUPERADMIN_EMAILS.size === 0) return process.env.NODE_ENV !== 'production';

  const verifiedUserId = await getVerifiedUserId(req);
  if (verifiedUserId) {
    const email = await getClerkUserEmail(verifiedUserId);
    return Boolean(email && SUPERADMIN_EMAILS.has(email));
  }

  const emailHeader = req.headers['x-admin-email'];
  const email = (Array.isArray(emailHeader) ? emailHeader[0] : emailHeader ?? '')
    .toLowerCase()
    .trim();

  return SUPERADMIN_EMAILS.has(email);
}
