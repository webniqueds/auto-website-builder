import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  getProjectById,
  saveProject,
  deleteProjectRecord,
} from '../_lib/db.js';
import { toStoredProject } from '../projects.js';

/**
 * GET    /api/projects/:id -> full project (used by preview-embedded pages)
 * PUT    /api/projects/:id -> upsert full project
 * DELETE /api/projects/:id -> delete project record
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = String(req.query.id ?? '');
  if (!id) return res.status(400).json({ error: 'Missing project id' });

  if (req.method === 'GET') {
    const doc = await getProjectById(id);
    if (!doc) return res.status(404).json({ error: 'Project not found' });
    const { _id, ...rest } = doc;
    return res.status(200).json(rest);
  }

  if (req.method === 'PUT') {
    const body = { ...((req.body ?? {}) as Record<string, unknown>), id };
    const doc = toStoredProject(body);
    if (!doc) return res.status(400).json({ error: 'Invalid payload' });
    await saveProject(doc);
    return res.status(200).json({ ok: true, id: doc.id });
  }

  if (req.method === 'DELETE') {
    await deleteProjectRecord(id);
    return res.status(200).json({ ok: true, id });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}