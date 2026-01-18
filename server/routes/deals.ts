
import express from 'express';
import { db } from '../db';
import { deals } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all deals
router.get('/', async (req, res) => {
  const result = await db.select().from(deals);
  res.json(result);
});

// Get a deal by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(deals).where(eq(deals.id, Number(id)));
  res.json(result[0]);
});

// Create a new deal
router.post('/', async (req, res) => {
  const { title, value, stage, companyId, contactId } = req.body;
  const newDeal = await db.insert(deals).values({
    title,
    value,
    stage,
    companyId,
    contactId,
  }).returning();
  res.json(newDeal[0]);
});

// Update a deal
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, value, stage, companyId, contactId } = req.body;
  const updatedDeal = await db.update(deals).set({
    title,
    value,
    stage,
    companyId,
    contactId,
  }).where(eq(deals.id, Number(id))).returning();
  res.json(updatedDeal[0]);
});

// Delete a deal
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(deals).where(eq(deals.id, Number(id)));
  res.json({ message: 'Deal deleted' });
});

export default router;
