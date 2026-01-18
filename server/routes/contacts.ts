
import express from 'express';
import { db } from '../db';
import { contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  const result = await db.select().from(contacts);
  res.json(result);
});

// Get a contact by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(contacts).where(eq(contacts.id, Number(id)));
  res.json(result[0]);
});

// Create a new contact
router.post('/', async (req, res) => {
  const { name, email, phone, companyId, platform } = req.body;
  const newContact = await db.insert(contacts).values({
    name,
    email,
    phone,
    companyId,
    platform
  }).returning();
  res.json(newContact[0]);
});

// Update a contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, companyId, platform } = req.body;
  const updatedContact = await db.update(contacts).set({
    name,
    email,
    phone,
    companyId,
    platform
  }).where(eq(contacts.id, Number(id))).returning();
  res.json(updatedContact[0]);
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(contacts).where(eq(contacts.id, Number(id)));
  res.json({ message: 'Contact deleted' });
});

export default router;
