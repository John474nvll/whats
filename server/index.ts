
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

// Function to parse command line arguments
const getPort = () => {
  const portIndex = process.argv.indexOf('--port');
  if (portIndex > -1 && process.argv[portIndex + 1]) {
    const port = parseInt(process.argv[portIndex + 1], 10);
    if (!isNaN(port)) return port;
  }
  const portEnv = process.env.PORT;
  if (portEnv && !isNaN(parseInt(portEnv, 10))) {
      return parseInt(portEnv, 10)
  }
  return 3000;
};

const PORT = getPort();

let server: Server;

async function startServer() {
  server = createServer(app);
  let vite: ViteDevServer | null = null;

  if (process.env.NODE_ENV === 'development') {
    vite = await setupVite(server, app);
  }

  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  server.on('error', (e: NodeJS.ErrnoException) => {
    if (e.code === 'EADDRINUSE') {
      console.log(`Port ${PORT} is already in use. Trying another port...`);
      setTimeout(() => {
        server.close();
        startServer(); // Restart the server on a new port if needed, though the env should handle this.
      }, 1000);
    } else {
        console.error("Server error:", e)
    }
  });

  server.on('close', async () => {
      if(vite){
          await vite.close()
      }
  })
}

startServer();
