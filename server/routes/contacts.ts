
import express from 'express';
import prisma from '../db';

const router = express.Router();

// Get all contacts
router.get('/', async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);
});

// Get a contact by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const contact = await prisma.contact.findUnique({
    where: { id: Number(id) },
  });
  res.json(contact);
});

// Create a new contact
router.post('/', async (req, res) => {
  const { name, email, phone, platform, companyId, ownerId } = req.body;
  const newContact = await prisma.contact.create({
    data: {
      name,
      email,
      phone,
      platform,
      companyId,
      ownerId,
    },
  });
  res.json(newContact);
});

// Update a contact
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, platform, companyId, ownerId } = req.body;
  const updatedContact = await prisma.contact.update({
    where: { id: Number(id) },
    data: {
      name,
      email,
      phone,
      platform,
      companyId,
      ownerId,
    },
  });
  res.json(updatedContact);
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.contact.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Contact deleted' });
});

export default router;
