import { Router, type Request, type Response } from 'express';
import generateSiteV2 from '../../api/generate-site-v2.js';
import generateSite from '../../api/generate-site.js';
import editSite from '../../api/edit-site.js';
import razorpayHandler from '../../api/razorpay.js';
import adminHandler from '../../api/admin.js';
import plansHandler from '../../api/plans.js';
import projectsHandler from '../../api/projects.js';
import purchasesHandler from '../../api/purchases.js';
import meHandler from '../../api/me.js';
import healthHandler from '../../api/health.js';

export const generateRouter = Router();

type ApiHandler = (req: never, res: never) => Promise<unknown> | unknown;

/**
 * Thin adapter that mounts the Vercel serverless handlers on the Express
 * router. Keeps local dev and the deployed API behaviourally identical.
 *
 * The consolidated handlers dispatch on `req.url`, which on Express is the
 * per-route path (e.g. `/db-status` for `GET /api/db-status`) and on Vercel
 * is the full original path (e.g. `/api/db-status`). The dispatch helpers
 * match a path segment either way.
 */
function adapt(handler: ApiHandler) {
  return (req: Request, res: Response) => {
    // Express 5 exposes `req.query` as a getter-only property, so assigning
    // throws. Bridge route params into query via a shadowing own property so
    // the Vercel-style handlers can read `req.query.id` uniformly on both
    // Express (local dev) and Vercel (serverless, where params already land in query).
    if (req.params && Object.keys(req.params).length > 0) {
      const merged: Request['query'] = { ...(req.query ?? {}), ...req.params };
      Object.defineProperty(req, 'query', {
        value: merged,
        configurable: true,
        enumerable: true,
        writable: true,
      });
    }
    return handler(req as never, res as never);
  };
}

generateRouter.post('/generate-site-v2', adapt(generateSiteV2));
generateRouter.post('/generate-site', adapt(generateSite));
generateRouter.post('/edit-site', adapt(editSite));
generateRouter.post('/razorpay/create-order', adapt(razorpayHandler));
generateRouter.post('/razorpay/verify-payment', adapt(razorpayHandler));
generateRouter.get('/admin-config', adapt(adminHandler));
generateRouter.get('/admin-stats', adapt(adminHandler));
generateRouter.get('/plans', adapt(plansHandler));
generateRouter.post('/plans', adapt(plansHandler));
generateRouter.post('/plans/reset', adapt(plansHandler));
generateRouter.delete('/plans', adapt(plansHandler));
generateRouter.get('/health', adapt(healthHandler));
generateRouter.get('/db-status', adapt(healthHandler));
generateRouter.get('/projects', adapt(projectsHandler));
generateRouter.post('/projects', adapt(projectsHandler));
generateRouter.get('/projects/:id', adapt(projectsHandler));
generateRouter.put('/projects/:id', adapt(projectsHandler));
generateRouter.delete('/projects/:id', adapt(projectsHandler));
generateRouter.get('/purchases', adapt(purchasesHandler));
generateRouter.post('/purchases', adapt(purchasesHandler));
generateRouter.get('/me', adapt(meHandler));
generateRouter.post('/me/spend', adapt(meHandler));