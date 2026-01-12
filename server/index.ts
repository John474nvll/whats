
import express from 'express';
import { createServer, Server } from 'http';
import { PrismaClient } from '@prisma/client';
import { sse } from './core/sse';
import crmRoutes from './api/crm';
import chatRoutes from './api/chat';
import userRoutes from './api/user';
import authRoutes from './api/auth';
import { authMiddleware } from './core/middleware/auth.middleware';
import { setupVite, ViteDevServer } from './vite';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// API routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/chat', authMiddleware, chatRoutes);

const getPort = () => {
  const portArg = process.argv.find(arg => arg.startsWith('--port'));
  if (portArg) {
      const port = portArg.split('=')[1] || portArg.split(' ')[1]
      if(port) return parseInt(port, 10);
  }
  return process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
};

const PORT = getPort();

async function startServer() {
  const server = createServer(app);
  let vite: ViteDevServer | null = null;

  if (process.env.NODE_ENV === 'development') {
    vite = await setupVite(server, app);
  }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', async () => {
    if (vite) {
      await vite.close();
    }
    server.close(() => {
      console.log('Server has been gracefully shut down.');
      process.exit(0);
    });
  });
}

startServer().catch(err => {
    console.error("Failed to start server:", err)
});
