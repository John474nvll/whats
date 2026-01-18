
import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// List all companies
router.get('/', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

// Get a single company
router.get('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const company = await prisma.company.findUnique({
    where: { id },
    include: {
      contacts: true,
      deals: true,
    },
  });
  if (!company) {
    return res.status(404).json({ error: 'Company not found' });
  }
  res.json(company);
});

// Create a new company
router.post('/', async (req, res) => {
  const { name, website, phone, address } = req.body;
  try {
    const newCompany = await prisma.company.create({
      data: {
        name,
        website,
        phone,
        address,
      },
    });
    res.status(201).json(newCompany);
  } catch (error) {
    res.status(500).json({ error: 'Could not create company' });
  }
});

// Update a company
router.put('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, website, phone, address } = req.body;
  try {
    const updatedCompany = await prisma.company.update({
      where: { id },
      data: {
        name,
        website,
        phone,
        address,
      },
    });
    res.json(updatedCompany);
  } catch (error) {
    res.status(500).json({ error: 'Could not update company' });
  }
});

// Delete a company
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await prisma.company.delete({
      where: { id },
    });
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete company' });
  }
});

export default router;
