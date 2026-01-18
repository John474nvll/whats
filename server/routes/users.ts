
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/users - Get all users
router.get('/', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// GET /api/users/:id - Get user by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: parseInt(id) },
  });
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// POST /api/users - Create a new user
router.post('/', async (req, res) => {
  const { name, email, password } = req.body;
  // In a real app, you should hash the password before saving it
  const newUser = await prisma.user.create({
    data: { name, email, password },
  });
  res.status(201).json(newUser);
});

// PUT /api/users/:id - Update a user
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const updatedUser = await prisma.user.update({
    where: { id: parseInt(id) },
    data: { name, email },
  });
  res.json(updatedUser);
});

// DELETE /api/users/:id - Delete a user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

export default router;
