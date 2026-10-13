import type { VercelRequest } from '@vercel/node';

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
 * The frontend passes the signed-in user's primary e-mail in the
 * `x-admin-email` header.  We check it against SUPERADMIN_EMAILS.
 *
 * When no superadmin e-mails are configured (local dev without env file)
 * the function returns true so the API stays usable during development.
 */
export function isAdminRequest(req: VercelRequest): boolean {
  // If no superadmin list is configured, allow through (local dev mode).
  if (SUPERADMIN_EMAILS.size === 0) return true;

  const emailHeader = req.headers['x-admin-email'];
  const email = (Array.isArray(emailHeader) ? emailHeader[0] : emailHeader ?? '').toLowerCase().trim();

  return SUPERADMIN_EMAILS.has(email);
}
