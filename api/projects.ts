import type { VercelRequest, VercelResponse } from '@vercel/node';
import {
  listProjects,
  saveProject,
  getProjectById,
  deleteProjectRecord,
  type StoredProject,
} from './_lib/db.js';
import { getVerifiedUserId } from './_lib/auth.js';

export function toStoredProject(body: Record<string, unknown>): StoredProject | null {
  const userId = typeof body.userId === 'string' ? body.userId : '';
  const id = typeof body.id === 'string' ? body.id : '';
  const config = body.config ?? {};
  const palette = body.palette ?? null;
  if (!userId || !id) return null;
  const now = Date.now();
  return {
    id,
    userId,
    name: typeof body.name === 'string' ? body.name : 'Untitled',
    templateId: typeof body.templateId === 'string' ? body.templateId : 'atelier',
    niche: typeof body.niche === 'string' ? body.niche : '',
    palette,
    config,
    createdAt: typeof body.createdAt === 'number' ? body.createdAt : now,
    updatedAt: typeof body.updatedAt === 'number' ? body.updatedAt : now,
  };
}

/** Extracts /api/projects/:id from the request URL, or '' when absent. */
function itemId(req: VercelRequest): string {
  const segs = (req.url ?? '').split('?')[0].split('/').filter(Boolean);
  const idx = segs.indexOf('projects');
  const id = idx >= 0 ? segs[idx + 1] : '';
  return id || '';
}

/**
 * One serverless function for all project routes:
 *   GET  /api/projects?userId=...   -> list (full records incl. config)
 *   POST /api/projects              -> upsert full project
 *   GET  /api/projects/:id          -> full project
 *   PUT  /api/projects/:id          -> upsert full project
 *   DELETE /api/projects/:id        -> delete project record
 * (merged to stay under Vercel Hobby's 12-function cap; dispatch on URL).
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const id = itemId(req);
  if (id) {
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

  if (req.method === 'POST') {
    const body = (req.body ?? {}) as Record<string, unknown>;
    const verified = await getVerifiedUserId(req);
    const doc = toStoredProject(verified ? { ...body, userId: verified } : body);
    if (!doc) return res.status(400).json({ error: 'Missing userId or project id' });
    await saveProject(doc);
    return res.status(200).json({ ok: true, id: doc.id });
  }

  if (req.method === 'GET') {
    const verified = await getVerifiedUserId(req);
    const userId = verified || String(req.query.userId ?? '');
    if (!userId) return res.status(400).json({ error: 'Missing userId' });
    // Full config is included so cross-device restore works: the client's
    // mergeRemoteProjects() skips records that have no config, and Preview
    // needs the config to render a project opened on a new device.
    const items = await listProjects(userId);
    return res.status(200).json({ items: items.map(({ _id, ...rest }) => rest) });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}