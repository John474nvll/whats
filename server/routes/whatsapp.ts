
import { Router } from 'express';
import { db } from '../db';
import { conversations, messages, contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { aiOrchestrator } from '../services/ai_orchestrator';

const router = Router();

router.post('/webhook', async (req, res) => {
  const { From, Body } = req.body;

  if (!From || !Body) {
    return res.status(400).json({ error: 'Invalid WhatsApp message format' });
  }

  try {
    let contact = await db.select().from(contacts).where(eq(contacts.phone, From)).get();

    if (!contact) {
      contact = await db.insert(contacts).values({ name: 'New Contact', phone: From }).returning().get();
    }

    let conversation = await db.select().from(conversations).where(eq(conversations.contactId, contact.id)).get();

    if (!conversation) {
      conversation = await db.insert(conversations).values({ contactId: contact.id, status: 'open' }).returning().get();
    }

    await db.insert(messages).values({
      conversationId: conversation.id,
      role: 'user',
      content: Body,
    });

    const response = await aiOrchestrator.handleIncomingMessage(Body, contact.id);

    await db.insert(messages).values({
      conversationId: conversation.id,
      role: 'assistant',
      content: response,
    });

    res.status(200).send("Message processed");
  } catch (error) {
    console.error('Error processing WhatsApp message:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
});

export default router;
