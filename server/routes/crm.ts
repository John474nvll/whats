
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { api } from '@shared/routes';

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

// === Conversations ===
crmRouter.get(api.conversations.list.path, async (req, res) => {
    const conversations = await prisma.conversation.findMany({ 
        include: { contact: true }, // Also fetch the related contact info
        orderBy: { updatedAt: 'desc' }
    });
    res.json(conversations);
});

crmRouter.get(api.conversations.get.path, async (req, res) => {
    const conversation = await prisma.conversation.findUnique({
        where: { id: Number(req.params.id) },
        include: { contact: true, messages: true },
    });
    if (!conversation) return res.status(404).json({ message: "Not found" });
    res.json(conversation);
});

// === Messages ===
crmRouter.get(api.conversations.messages.list.path, async (req, res) => {
    const messages = await prisma.message.findMany({
        where: { conversationId: Number(req.params.id) },
        orderBy: { createdAt: 'asc' }
    });
    res.json(messages);
});

crmRouter.post(api.conversations.messages.create.path, async (req, res) => {
    try {
      const input = api.conversations.messages.create.input.parse(req.body);
      const message = await prisma.message.create({
        data: {
          conversationId: Number(req.params.id),
          content: input.content,
          role: "agent",
          sentiment: "neutral" // AI sentiment can be added later
        }
      });
      res.status(201).json(message);
    } catch (e) {
      res.status(400).json({ message: "Invalid input" });
    }
});

export default crmRouter;
