
import express from 'express';
import { db } from '../db';
import { interactions } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all interactions
router.get('/', async (req, res) => {
  const result = await db.select().from(interactions);
  res.json(result);
});

// Get a interaction by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(interactions).where(eq(interactions.id, Number(id)));
  res.json(result[0]);
});

// Create a new interaction
router.post('/', async (req, res) => {
  const { type, content, userId, contactId, dealId } = req.body;
  const newInteraction = await db.insert(interactions).values({
    type,
    content,
    userId,
    contactId,
    dealId,
  }).returning();
  res.json(newInteraction[0]);
});

// Update a interaction
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { type, content, userId, contactId, dealId } = req.body;
  const updatedInteraction = await db.update(interactions).set({
    type,
    content,
    userId,
    contactId,
    dealId,
  }).where(eq(interactions.id, Number(id))).returning();
  res.json(updatedInteraction[0]);
});

// Delete a interaction
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(interactions).where(eq(interactions.id, Number(id)));
  res.json({ message: 'Interaction deleted' });
});

export default router;
