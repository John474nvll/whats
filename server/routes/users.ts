
import express from 'express';
import { db } from '../db';
import { users } from '@shared/schema';
import { eq } from 'drizzle-orm';

const router = express.Router();

// Get all users
router.get('/', async (req, res) => {
  const result = await db.select().from(users);
  res.json(result);
});

// Get a user by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const result = await db.select().from(users).where(eq(users.id, Number(id)));
  res.json(result[0]);
});

// Create a new user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  const newUser = await db.insert(users).values({
    name,
    email,
    password,
  }).returning();
  res.json(newUser[0]);
});

// Update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;
  const updatedUser = await db.update(users).set({
    name,
    email,
    password,
  }).where(eq(users.id, Number(id))).returning();
  res.json(updatedUser[0]);
});

// Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await db.delete(users).where(eq(users.id, Number(id)));
  res.json({ message: 'User deleted' });
});

export default router;
