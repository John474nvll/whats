
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const crmRouter = Router();

// TODO: This should be tied to an authenticated user
const TEMP_USER_ID = 1;

// === Contacts ===
crmRouter.get('/contacts', async (req, res) => {
  const contacts = await prisma.contact.findMany({ where: { userId: TEMP_USER_ID }});
  res.json(contacts);
});

crmRouter.post('/contacts', async (req, res) => {
  const newContact = await prisma.contact.create({ 
    data: { ...req.body, userId: TEMP_USER_ID } 
  });
  res.status(201).json(newContact);
});

crmRouter.put('/contacts/:id', async (req, res) => {
  const updatedContact = await prisma.contact.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(updatedContact);
});

crmRouter.delete('/contacts/:id', async (req, res) => {
  await prisma.contact.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

// === Customers ===
crmRouter.get('/customers', async (req, res) => {
  const customers = await prisma.customer.findMany({ where: { userId: TEMP_USER_ID }});
  res.json(customers);
});

crmRouter.post('/customers', async (req, res) => {
  const newCustomer = await prisma.customer.create({ 
    data: { ...req.body, userId: TEMP_USER_ID } 
  });
  res.status(201).json(newCustomer);
});

crmRouter.put('/customers/:id', async (req, res) => {
  const updatedCustomer = await prisma.customer.update({
    where: { id: Number(req.params.id) },
    data: req.body,
  });
  res.json(updatedCustomer);
});

crmRouter.delete('/customers/:id', async (req, res) => {
  await prisma.customer.delete({ where: { id: Number(req.params.id) } });
  res.status(204).send();
});

export default crmRouter;
