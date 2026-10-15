import type { VercelRequest, VercelResponse } from '@vercel/node';
import { countAllProjects, listAllPurchases, listPlans } from './_lib/db.js';
import { isAdminRequest } from './_lib/adminAuth.js';

const ADMIN_EMAILS = (process.env.SUPERADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

function isStats(req: VercelRequest): boolean {
  return (req.url ?? '').split('?')[0].split('/').includes('admin-stats');
}

function handleConfig(_req: VercelRequest, res: VercelResponse) {
  return res.status(200).json({ emails: ADMIN_EMAILS });
}

async function handleStats(req: VercelRequest, res: VercelResponse) {
  if (!(await isAdminRequest(req))) return res.status(403).json({ error: 'Forbidden' });

  const [projects, purchases, plans] = await Promise.all([
    countAllProjects(),
    listAllPurchases(),
    listPlans(),
  ]);

  const byPlan = new Map<
    string,
    { planId: string; name: string; count: number; credits: number; revenue: number }
  >();
  for (const p of purchases) {
    const key = p.planId || 'custom';
    const entry = byPlan.get(key) ?? {
      planId: key,
      name: p.name || key,
      count: 0,
      credits: 0,
      revenue: 0,
    };
    entry.count += 1;
    entry.credits += p.credits || 0;
    entry.revenue += p.price || 0;
    byPlan.set(key, entry);
  }

  const revenue = purchases.reduce((s, p) => s + (p.price || 0), 0);
  const creditsSold = purchases.reduce((s, p) => s + (p.credits || 0), 0);

  const recent = [...purchases]
    .sort((a, b) => b.createdAt - a.createdAt)
    .slice(0, 10)
    .map(({ _id, userId: _u, ...rest }) => rest);

  return res.status(200).json({
    projects,
    purchases: purchases.length,
    revenue,
    creditsSold,
    activePlans: plans.filter((p) => p.active).length,
    byPlan: [...byPlan.values()].sort((a, b) => b.revenue - a.revenue),
    recent,
  });
}

/**
 * One serverless function for both admin endpoints:
 *   GET /api/admin-config
 *   GET /api/admin-stats
 * (merged to stay under Vercel Hobby's 12-function cap; dispatch on URL).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return isStats(req) ? handleStats(req, res) : handleConfig(req, res);
}