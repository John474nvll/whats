import type { Express } from 'express';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { authMiddleware } from './middleware/auth';

export function registerMiddleware(app: Express) {
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // Apply auth middleware to all /api routes except auth endpoints
  app.use('/api', (req, res, next) => {
    if (
      req.path.startsWith('/api/auth') ||
      req.path.startsWith('/api/public')
    ) {
      return next();
    }
    return authMiddleware(req, res, next);
  });
}

export function setupMiddleware(app: Express) {
  registerMiddleware(app);
}
