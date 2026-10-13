import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isDbConfigured } from './_lib/db.js';

function isDbStatus(req: VercelRequest): boolean {
  return (req.url ?? '').split('?')[0].split('/').includes('db-status');
}

/**
 * Single serverless function for /api/health and /api/db-status
 * (folded together to stay under Vercel Hobby's 12-function cap).
 */
export default function handler(req: VercelRequest, res: VercelResponse) {
  if (isDbStatus(req)) {
    return res.status(200).json({
      db: isDbConfigured() ? 'mongodb' : 'memory',
      razorpay: {
        configured: Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET),
        demo: process.env.RAZORPAY_DEMO === '1' || process.env.RAZORPAY_DEMO === 'true',
      },
    });
  }
  return res.status(200).json({ status: 'ok' });
}