
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// List all deals
router.get('/', async (req, res) => {
  const deals = await prisma.deal.findMany({
    include: {
      company: true,
      contact: true,
      owner: true,
    },
  });
  res.json(deals);
});

// Get a single deal
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const deal = await prisma.deal.findUnique({
    where: { id },
    include: {
      company: true,
      contact: true,
      owner: true,
      interactions: true,
    },
  });
  if (!deal) {
    return res.status(404).json({ error: 'Deal not found' });
  }
  res.json(deal);
});

// Create a new deal
router.post('/', async (req, res) => {
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
  try {
    const newDeal = await prisma.deal.create({
      data: {
        title,
        value,
        stage,
        companyId,
        contactId,
        ownerId,
      },
    });
    res.status(201).json(newDeal);
  } catch (error) {
    res.status(500).json({ error: 'Could not create deal' });
  }
});

// Update a deal
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
  try {
    const updatedDeal = await prisma.deal.update({
      where: { id },
      data: {
        title,
        value,
        stage,
        companyId,
        contactId,
        ownerId,
      },
    });
    res.json(updatedDeal);
  } catch (error) {
    res.status(500).json({ error: 'Could not update deal' });
  }
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.deal.delete({
      where: { id },
    });
    res.json({ message: 'Deal deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete deal' });
  }
});

export default router;
