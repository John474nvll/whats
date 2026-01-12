
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sse } from './core/sse';
import crmRoutes from './api/crm';
import chatRoutes from './api/chat';
import userRoutes from './api/user';
import authRoutes from './api/auth';
import { authMiddleware } from './core/middleware/auth.middleware';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Basic route for SSE
app.get('/events', sse.init);

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

// Function to parse command line arguments
const getPort = () => {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex > -1 && process.argv[portIndex + 1]) {
    return parseInt(process.argv[portIndex + 1], 10);
  }
  return null;
};

const PORT = getPort() || process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
