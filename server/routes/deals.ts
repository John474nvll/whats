
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/deals - Get all deals
router.get('/', async (req, res) => {
  const deals = await prisma.deal.findMany({
    include: { company: true, contact: true, owner: true },
  });
  res.json(deals);
});

// GET /api/deals/:id - Get deal by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const deal = await prisma.deal.findUnique({
    where: { id: parseInt(id) },
    include: { company: true, contact: true, owner: true, interactions: true },
  });
  if (deal) {
    res.json(deal);
  } else {
    res.status(404).json({ error: 'Deal not found' });
  }
});

// POST /api/deals - Create a new deal
router.post('/', async (req, res) => {
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
  const newDeal = await prisma.deal.create({
    data: { title, value, stage, companyId, contactId, ownerId },
  });
  res.status(201).json(newDeal);
});

// PUT /api/deals/:id - Update a deal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
  const updatedDeal = await prisma.deal.update({
    where: { id: parseInt(id) },
    data: { title, value, stage, companyId, contactId, ownerId },
  });
  res.json(updatedDeal);
});

// DELETE /api/deals/:id - Delete a deal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.deal.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

export default router;
