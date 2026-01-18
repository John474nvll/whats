
import express from 'express';
import prisma from '../db';

const router = express.Router();

// Get all deals
router.get('/', async (req, res) => {
  const deals = await prisma.deal.findMany();
  res.json(deals);
});

// Get a deal by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const deal = await prisma.deal.findUnique({
    where: { id: Number(id) },
  });
  res.json(deal);
});

// Create a new deal
router.post('/', async (req, res) => {
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
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
  res.json(newDeal);
});

// Update a deal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, value, stage, companyId, contactId, ownerId } = req.body;
  const updatedDeal = await prisma.deal.update({
    where: { id: Number(id) },
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
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.deal.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Deal deleted' });
});

export default router;
