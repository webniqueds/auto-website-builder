import type { VercelRequest, VercelResponse } from '@vercel/node';
import { listPlans, savePlanRecord, deletePlanRecord, replaceAllPlans, type StoredPlan } from './_lib/db.js';
import { isAdminRequest } from './_lib/adminAuth.js';

const DEFAULT_PLANS: StoredPlan[] = [
  {
    id: 'seed',
    name: 'Seed',
    tagline: 'For getting your first site live.',
    description: 'A starter pack of credits to try serious building.',
    price: 99,
    currency: 'INR',
    credits: 15,
    features: ['15 site credits', 'Full site export', 'All 15 templates', 'AI editing & version history'],
    exportAccess: true,
    popular: false,
    active: true,
    updatedAt: Date.now(),
  },
  {
    id: 'growth',
    name: 'Growth',
    tagline: 'Best value for active builders.',
    description: 'Enough credits to build and iterate all month.',
    price: 249,
    currency: 'INR',
    credits: 60,
    features: ['60 site credits', 'Full site export', 'All 15 templates', 'Priority generation'],
    exportAccess: true,
    popular: true,
    active: true,
    updatedAt: Date.now(),
  },
  {
    id: 'scale',
    name: 'Scale',
    tagline: 'For agencies & power users.',
    description: 'A big block of credits for building client sites.',
    price: 499,
    currency: 'INR',
    credits: 200,
    features: ['200 site credits', 'Full site export', 'All 15 templates', 'Priority generation', 'Onboarding help'],
    exportAccess: true,
    popular: false,
    active: true,
    updatedAt: Date.now(),
  },
];

function isReset(req: VercelRequest): boolean {
  return (req.url ?? '').split('?')[0].split('/').includes('reset');
}

/**
 * GET    /api/plans                       -> plan list (source of truth)
 * POST   /api/plans                       -> upsert one plan (superadmin only)
 * POST   /api/plans/reset                 -> restore defaults (superadmin only)
 * DELETE /api/plans?id=...                -> delete one plan (superadmin only)
 *
 * All in one serverless function to stay under Vercel Hobby's 12-function cap.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const items = await listPlans();
    return res.status(200).json({ items: items.map(({ _id, ...rest }) => rest) });
  }

  if (req.method === 'POST') {
    if (!isAdminRequest(req)) return res.status(403).json({ error: 'Forbidden' });

    if (isReset(req)) {
      await replaceAllPlans(DEFAULT_PLANS);
      return res.status(200).json({ ok: true, count: DEFAULT_PLANS.length });
    }

    const body = (req.body ?? {}) as Record<string, unknown>;
    const id = typeof body.id === 'string' ? body.id : '';
    const name = typeof body.name === 'string' ? body.name.trim() : '';
    if (!id || !name) {
      return res.status(400).json({ error: 'Plan id and name are required' });
    }
    const plan: StoredPlan = {
      id,
      name,
      tagline: typeof body.tagline === 'string' ? body.tagline : '',
      description: typeof body.description === 'string' ? body.description : '',
      price: Number(body.price) || 0,
      currency: typeof body.currency === 'string' ? body.currency : 'INR',
      credits: Number(body.credits) || 0,
      features: Array.isArray(body.features) ? body.features.map(String) : [],
      exportAccess: body.exportAccess === undefined ? true : Boolean(body.exportAccess),
      popular: Boolean(body.popular),
      active: body.active === undefined ? true : Boolean(body.active),
      updatedAt: typeof body.updatedAt === 'number' ? body.updatedAt : Date.now(),
    };
    await savePlanRecord(plan);
    return res.status(200).json({ ok: true, id: plan.id });
  }

  if (req.method === 'DELETE') {
    if (!isAdminRequest(req)) return res.status(403).json({ error: 'Forbidden' });
    const id = String(req.query.id ?? '');
    if (!id) return res.status(400).json({ error: 'Missing plan id' });
    await deletePlanRecord(id);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}