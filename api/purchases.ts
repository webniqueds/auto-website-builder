import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listPurchases, savePurchase, type StoredPurchase } from './_lib/db.js';

/**
 * GET  /api/purchases?userId=... -> purchase history
 * POST /api/purchases            -> record a purchase (store level credits)
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'POST') {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const userId = typeof body.userId === 'string' ? body.userId : '';
    const id = typeof body.id === 'string' ? body.id : '';
    if (!userId || !id) return res.status(400).json({ error: 'Missing userId or purchase id' });
    const doc: StoredPurchase = {
      id,
      userId,
      planId: typeof body.planId === 'string' ? body.planId : 'custom',
      name: typeof body.name === 'string' ? body.name : 'Plan',
      price: Number(body.price) || 0,
      credits: Number(body.credits) || 0,
      paymentId: typeof body.paymentId === 'string' ? body.paymentId : undefined,
      exportAccess: Boolean(body.exportAccess),
      createdAt: typeof body.createdAt === 'number' ? body.createdAt : Date.now(),
    };
    await savePurchase(doc);
    return res.status(200).json({ ok: true, id: doc.id });
  }

  if (req.method === 'GET') {
    const userId = String(req.query.userId ?? '');
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    const items = await listPurchases(userId);
    return res.status(200).json({
      items: items.map(({ _id, userId: _u, ...rest }) => rest),
    });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}