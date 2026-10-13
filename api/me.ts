import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listPurchases, getUser, incrementCreditsSpent } from './_lib/db.js';

const FREE_START_CREDITS = 3;

function isSpend(req: VercelRequest): boolean {
  return (req.url ?? '').split('?')[0].split('/').includes('spend');
}

/**
 * GET  /api/me?userId=<clerk-user-id>
 *      Returns the signed-in user's computed credit balance and full purchase
 *      history. Called once on sign-in to hydrate localStorage so the balance
 *      is correct regardless of which device the user is on.
 *
 *      balance = FREE_START_CREDITS + totalPurchasedCredits − creditsSpent
 *
 * POST /api/me/spend  { userId, amount }
 *      Fire-and-forget: atomically increments the user's creditsSpent ($inc,
 *      upsert on first spend) so concurrent serverless calls never lose an
 *      increment.
 *
 * Both endpoints live in one function to stay under Vercel Hobby's
 * 12-function cap; dispatch happens on the URL.
 */

async function handleMe(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const userId = String(req.query.userId ?? '').trim();
  if (!userId) return res.status(400).json({ error: 'Missing userId' });

  try {
    const [purchases, userDoc] = await Promise.all([
      listPurchases(userId),
      getUser(userId),
    ]);

    const totalPurchased = purchases.reduce((sum, p) => sum + (p.credits || 0), 0);
    const creditsSpent = userDoc?.creditsSpent ?? 0;
    const credits = Math.max(0, FREE_START_CREDITS + totalPurchased - creditsSpent);

    return res.status(200).json({
      credits,
      purchases: purchases.map(({ _id, userId: _u, ...rest }) => rest),
    });
  } catch (err) {
    console.error('[me] Error fetching user state:', err);
    return res.status(500).json({ error: 'Failed to load user data' });
  }
}

async function handleSpend(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = (req.body ?? {}) as Record<string, unknown>;
  const userId = typeof body.userId === 'string' ? body.userId.trim() : '';
  const amount = typeof body.amount === 'number' && body.amount > 0 ? body.amount : 0;

  if (!userId || amount === 0) {
    return res.status(400).json({ error: 'Missing userId or invalid amount' });
  }

  try {
    await incrementCreditsSpent(userId, amount);
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('[me/spend] Error recording spend:', err);
    return res.status(500).json({ error: 'Failed to record credit spend' });
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  return isSpend(req) ? handleSpend(req, res) : handleMe(req, res);
}