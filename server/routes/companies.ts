
import express from 'express';
import { db } from '../db';
import { companies } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  const result = await db.select().from(companies);
  res.json(result);
});

// Get a company by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(companies).where(eq(companies.id, Number(id)));
  res.json(result[0]);
});

// Create a new company
router.post('/', async (req, res) => {
  const { name, website, phone, address } = req.body;
  const newCompany = await db.insert(companies).values({
    name,
    website,
    phone,
    address,
  }).returning();
  res.json(newCompany[0]);
});

// Update a company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, website, phone, address } = req.body;
  const updatedCompany = await db.update(companies).set({
    name,
    website,
    phone,
    address,
  }).where(eq(companies.id, Number(id))).returning();
  res.json(updatedCompany[0]);
});

// Delete a company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(companies).where(eq(companies.id, Number(id)));
  res.json({ message: 'Company deleted' });
});

export default router;
