
import express from 'express';
import prisma from '../db';

const router = express.Router();

// Get all interactions
router.get('/', async (req, res) => {
  const interactions = await prisma.interaction.findMany();
  res.json(interactions);
});

// Get a interaction by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const interaction = await prisma.interaction.findUnique({
    where: { id: Number(id) },
  });
  res.json(interaction);
});

// Create a new interaction
router.post('/', async (req, res) => {
  const { type, content, userId, contactId, dealId } = req.body;
  const newInteraction = await prisma.interaction.create({
    data: {
      type,
      content,
      userId,
      contactId,
      dealId,
    },
  });
  res.json(newInteraction);
});

// Update a interaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, content, userId, contactId, dealId } = req.body;
  const updatedInteraction = await prisma.interaction.update({
    where: { id: Number(id) },
    data: {
      type,
      content,
      userId,
      contactId,
      dealId,
    },
  });
  res.json(updatedInteraction);
});

// Delete a interaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.interaction.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Interaction deleted' });
});

export default router;
