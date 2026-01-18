
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// List all contacts
router.get('/', async (req, res) => {
  const contacts = await prisma.contact.findMany({
    include: {
      company: true,
      owner: true,
    },
  });
  res.json(contacts);
});

// Get a single contact
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const contact = await prisma.contact.findUnique({
    where: { id },
    include: {
      company: true,
      owner: true,
      deals: true,
      interactions: true,
    },
  });
  if (!contact) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  res.json(contact);
});

// Create a new contact
router.post('/', async (req, res) => {
  const { name, email, phone, platform, companyId, ownerId } = req.body;
  try {
    const newContact = await prisma.contact.create({
      data: {
        name,
        email,
        phone,
        platform: platform || 'manual',
        companyId,
        ownerId,
      },
    });
    res.status(201).json(newContact);
  } catch (error) {
    res.status(500).json({ error: 'Could not create contact' });
  }
});

// Update a contact
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email, phone, companyId, ownerId } = req.body;
  try {
    const updatedContact = await prisma.contact.update({
      where: { id },
      data: {
        name,
        email,
        phone,
        companyId,
        ownerId,
      },
    });
    res.json(updatedContact);
  } catch (error) {
    res.status(500).json({ error: 'Could not update contact' });
  }
});

// Delete a contact
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.contact.delete({
      where: { id },
    });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete contact' });
  }
});

export default router;
