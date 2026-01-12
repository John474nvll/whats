
import express from 'express';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { sse } from './core/sse';
import crmRoutes from './api/crm';
import chatRoutes from './api/chat';
import userRoutes from './api/user';
import authRoutes from './api/auth';
import { authMiddleware } from './core/middleware/auth.middleware';
import { setupVite } from './vite';

const app = express();
const server = createServer(app);
const prisma = new PrismaClient();

app.use(express.json());

// Basic route for SSE
app.get('/events', sse.init);

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

if (process.env.NODE_ENV === 'development') {
  setupVite(server, app);
} else {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
