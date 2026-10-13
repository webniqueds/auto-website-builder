import type { VercelRequest, VercelResponse } from '@vercel/node';
import v2Handler from './generate-site-v2.js';

/**
 * v1 route — kept for backwards compatibility. Shares the same AI-driven
 * pipeline as v2 so every generation path is API-based (no rule-based fallback).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  return v2Handler(req, res);
}