
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// List all interactions
router.get('/', async (req, res) => {
  const interactions = await prisma.interaction.findMany({
    include: {
      user: true,
      contact: true,
      deal: true,
    },
  });
  res.json(interactions);
});

// Get a single interaction
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const interaction = await prisma.interaction.findUnique({
    where: { id },
    include: {
      user: true,
      contact: true,
      deal: true,
    },
  });
  if (!interaction) {
    return res.status(404).json({ error: 'Interaction not found' });
  }
  res.json(interaction);
});

// Create a new interaction
router.post('/', async (req, res) => {
  const { type, content, userId, contactId, dealId } = req.body;
  try {
    const newInteraction = await prisma.interaction.create({
      data: {
        type,
        content,
        userId,
        contactId,
        dealId,
      },
    });
    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(500).json({ error: 'Could not create interaction' });
  }
});

// Update an interaction
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { type, content } = req.body;
  try {
    const updatedInteraction = await prisma.interaction.update({
      where: { id },
      data: {
        type,
        content,
      },
    });
    res.json(updatedInteraction);
  } catch (error) {
    res.status(500).json({ error: 'Could not update interaction' });
  }
});

// Delete an interaction
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.interaction.delete({
      where: { id },
    });
    res.json({ message: 'Interaction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete interaction' });
  }
});

export default router;
