
import express from 'express';
import { PrismaClient } from '@prisma/client';
import { sse } from './core/sse';
import crmRoutes from './api/crm';
import chatRoutes from './api/chat';

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

// Basic route for SSE
app.get('/events', sse.init);

// API routes
app.use('/api/crm', crmRoutes);
app.use('/api/chat', chatRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
