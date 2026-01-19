import { Elysia } from 'elysia';
import { db } from '../db';
import { conversations, messages, contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { aiOrchestrator } from '../services/ai_orchestrator';

export const whatsappRoutes = new Elysia()
  .post('/webhook', async ({ body }: { body: any }) => {
    const { From, Body } = body;

    if (!From || !Body) {
      return new Response(JSON.stringify({ error: 'Invalid WhatsApp message format' }), { status: 400 });
    }

    try {
      let [contact] = await db.select().from(contacts).where(eq(contacts.phone, From));

      if (!contact) {
        [contact] = await db.insert(contacts).values({ name: 'New Contact', phone: From }).returning();
      }

      let [conversation] = await db.select().from(conversations).where(eq(conversations.contactId, contact.id));

      if (!conversation) {
        [conversation] = await db.insert(conversations).values({ contactId: contact.id, status: 'open' }).returning();
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

      return { message: "Message processed" };
    } catch (error) {
      console.error('Error processing WhatsApp message:', error);
      return new Response(JSON.stringify({ error: 'Failed to process message' }), { status: 500 });
    }
  });

export default whatsappRoutes;
