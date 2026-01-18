
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

// GET /api/companies - Get all companies
router.get('/', async (req, res) => {
  const companies = await prisma.company.findMany();
  res.json(companies);
});

// GET /api/companies/:id - Get company by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const company = await prisma.company.findUnique({
    where: { id: parseInt(id) },
    include: { contacts: true, deals: true },
  });
  if (company) {
    res.json(company);
  } else {
    res.status(404).json({ error: 'Company not found' });
  }
});

// POST /api/companies - Create a new company
router.post('/', async (req, res) => {
  const { name, website, phone, address } = req.body;
  const newCompany = await prisma.company.create({
    data: { name, website, phone, address },
  });
  res.status(201).json(newCompany);
});

// PUT /api/companies/:id - Update a company
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, website, phone, address } = req.body;
  const updatedCompany = await prisma.company.update({
    where: { id: parseInt(id) },
    data: { name, website, phone, address },
  });
  res.json(updatedCompany);
});

// DELETE /api/companies/:id - Delete a company
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.company.delete({
    where: { id: parseInt(id) },
  });
  res.status(204).send();
});

export default router;
