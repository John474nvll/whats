
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/interactions - Get all interactions
router.get('/', async (req, res) => {
  const interactions = await prisma.interaction.findMany({
    include: { user: true, contact: true, deal: true },
  });
  res.json(interactions);
});

// POST /api/interactions - Create a new interaction
router.post('/', async (req, res) => {
  const { type, content, userId, contactId, dealId } = req.body;
  const newInteraction = await prisma.interaction.create({
    data: { type, content, userId, contactId, dealId },
  });
  res.status(201).json(newInteraction);
});

export default router;
