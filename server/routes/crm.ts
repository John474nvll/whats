
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const crmRouter = Router();

// ====== Contacts Endpoints ======

crmRouter.get('/contacts', async (req, res) => {
  const contacts = await prisma.contact.findMany();
  res.json(contacts);
});

crmRouter.post('/contacts', async (req, res) => {
  const { name, phone, platform, email } = req.body;
  const newContact = await prisma.contact.create({
    data: { name, phone, platform, email, userId: 1 }, // Assuming a default user for now
  });
  res.status(201).json(newContact);
});

crmRouter.put('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  const { name, phone, platform, email } = req.body;
  const updatedContact = await prisma.contact.update({
    where: { id: parseInt(id) },
    data: { name, phone, platform, email },
  });
  res.json(updatedContact);
});

crmRouter.delete('/contacts/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.contact.delete({ where: { id: parseInt(id) } });
  res.status(204).send();
});

// ====== Customers Endpoints ======

crmRouter.get('/customers', async (req, res) => {
  const customers = await prisma.customer.findMany();
  res.json(customers);
});

crmRouter.post('/customers', async (req, res) => {
  const newCustomer = await prisma.customer.create({ data: req.body });
  res.status(201).json(newCustomer);
});

// ====== NEW: Conversation Endpoint ======

crmRouter.post('/conversations/find-or-create', async (req, res) => {
  const { contactId } = req.body;

  if (!contactId) {
    return res.status(400).json({ message: 'El ID del contacto es requerido' });
  }

  try {
    // 1. Check for an existing conversation
    let conversation = await prisma.conversation.findFirst({
      where: { contactId: parseInt(contactId) },
    });

    // 2. If it exists, return its ID
    if (conversation) {
      return res.json({ conversationId: conversation.id });
    }

    // 3. If not, create a new one
    const contact = await prisma.contact.findUnique({ where: { id: parseInt(contactId) } });
    if (!contact) {
      return res.status(404).json({ message: 'Contacto no encontrado' });
    }

    // Find a channel that matches the contact's platform
    const channel = await prisma.channel.findFirst({
      where: { platform: contact.platform },
    });

    if (!channel) {
      // If no channel exists, create a placeholder or return an error
      return res.status(404).json({ message: `No se encontró un canal para la plataforma: ${contact.platform}. Por favor, configure uno.` });
    }
    
    // Create the new conversation
    const newConversation = await prisma.conversation.create({
      data: {
        contactId: contact.id,
        channelId: channel.id,
        status: 'open', // Default status
        lastMessageAt: new Date(),
      },
    });

    return res.status(201).json({ conversationId: newConversation.id });

  } catch (error) {
    console.error("Error en find-or-create conversation:", error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});


export default crmRouter;
