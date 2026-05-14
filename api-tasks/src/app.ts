import express, { Application } from 'express';
import cors    from 'cors';
import helmet  from 'helmet';
import { apiRouter }        from './routes';
import { errorHandler }     from './middleware/error.middleware';
import { loggerMiddleware } from './middleware/logger.middleware';
import { apiLimiter }       from './middleware/rateLimiter';

export const createApp = (): Application => {
  const app = express();

  // ── Seguridad ──────────────────────────────────
  app.use(helmet());
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? '*',
    credentials: true
  }));
  app.use('/api', apiLimiter);

  // ── Body parsing ───────────────────────────────
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: false }));

  // ── Logger ────────────────────────────────────
  app.use(loggerMiddleware);

  // ── Rutas ─────────────────────────────────────
  app.use('/api/v1', apiRouter);

  // ── Health check ──────────────────────────────
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // ── Error handler SIEMPRE al final ────────────
  app.use(errorHandler);

  return app;
};