
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/contacts - Get all contacts
router.get('/', async (req, res) => {
  const contacts = await prisma.contact.findMany({
    include: { company: true, owner: true },
  });
  res.json(contacts);
});

// GET /api/contacts/:id - Get contact by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const contact = await prisma.contact.findUnique({
    where: { id: parseInt(id) },
    include: { company: true, owner: true, deals: true, interactions: true },
  });
  if (contact) {
    res.json(contact);
  } else {
    res.status(404).json({ error: 'Contact not found' });
  }
});

// POST /api/contacts - Create a new contact
router.post('/', async (req, res) => {
  const { name, email, phone, platform, companyId, ownerId } = req.body;
  const newContact = await prisma.contact.create({
    data: { name, email, phone, platform, companyId, ownerId },
  });
  res.status(201).json(newContact);
});

// PUT /api/contacts/:id - Update a contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, platform, companyId, ownerId } = req.body;
  const updatedContact = await prisma.contact.update({
    where: { id: parseInt(id) },
    data: { name, email, phone, platform, companyId, ownerId },
  });
  res.json(updatedContact);
});

// DELETE /api/contacts/:id - Delete a contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.contact.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

export default router;
