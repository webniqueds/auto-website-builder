import express from 'express';
import cors from 'cors';
import { generateRouter } from './routes/generate.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:5174'] }));
  app.use(express.json({ limit: '10mb' }));

  app.use('/api', generateRouter);

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });

  app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}