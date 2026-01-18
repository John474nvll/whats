
import express from 'express';
import prisma from '../db';

const router = express.Router();

// Get all companies
router.get('/', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

// Get a company by id
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id: Number(id) },
  });
  res.json(company);
});

// Create a new company
router.post('/', async (req, res) => {
  const { name, website, phone, address } = req.body;
  const newCompany = await prisma.company.create({
    data: {
      name,
      website,
      phone,
      address,
    },
  });
  res.json(newCompany);
});

// Update a company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, website, phone, address } = req.body;
  const updatedCompany = await prisma.company.update({
    where: { id: Number(id) },
    data: {
      name,
      website,
      phone,
      address,
    },
  });
  res.json(updatedCompany);
});

// Delete a company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.company.delete({
    where: { id: Number(id) },
  });
  res.json({ message: 'Company deleted' });
});

export default router;
