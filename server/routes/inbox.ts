
import { Elysia, t } from 'elysia';
import { db } from '../db';
import { conversations, messages, contacts } from '@shared/schema';
import { eq, desc } from 'drizzle-orm';
import { sendWhatsAppMessage } from '../services/whatsapp';

export const inboxRoutes = new Elysia({ prefix: '/inbox' })
  // GET /api/inbox/conversations - Fetches all conversations with their last message
  .get('/conversations', async () => {
    const result = await db.query.conversations.findMany({
      with: {
        contact: {
          columns: {
            name: true,
            phone: true,
          },
        },
        messages: {
          columns: {
            content: true,
            createdAt: true,
          },
          orderBy: (messages, { desc }) => [desc(messages.createdAt)],
          limit: 1,
        },
      },
      orderBy: (conversations, { desc }) => [desc(conversations.lastMessageAt)],
    });

    const formattedConversations = result.map(c => ({
      id: c.id,
      contactName: c.contact?.name || 'Unknown Contact',
      contactPhone: c.contact?.phone,
      lastMessage: c.messages[0]?.content || 'No messages yet...',
      lastMessageAt: c.messages[0]?.createdAt || c.lastMessageAt,
      botStatus: c.botStatus,
    }));

    return formattedConversations;
  })

  // GET /api/inbox/conversations/:id - Fetches details for a single conversation
  .get('/conversations/:id', async ({ params }) => {
    const conversationId = parseInt(params.id, 10);
    const [conversation] = await db.select().from(conversations).where(eq(conversations.id, conversationId));
    if (!conversation) {
      return new Response('Conversation not found', { status: 404 });
    }
    return conversation;
  })

  // GET /api/inbox/conversations/:id/messages - Fetches messages for a conversation
  .get('/conversations/:id/messages', async ({ params }) => {
    const conversationId = parseInt(params.id, 10);
    const result = await db.select().from(messages).where(eq(messages.conversationId, conversationId)).orderBy(messages.createdAt);
    return result;
  })

  // POST /api/inbox/conversations/:id/send - Sends a message from an agent
  .post('/conversations/:id/send', async ({ params, body }) => {
    const conversationId = parseInt(params.id, 10);
    const { content } = body as { content: string };

    const [conversation] = await db.query.conversations.findMany({ where: eq(conversations.id, conversationId), with: { contact: true } });
    if (!conversation || !conversation.contact) {
      return new Response('Conversation or contact not found', { status: 404 });
    }

    // Send message via WhatsApp
    await sendWhatsAppMessage(conversation.contact.phone!, content);

    // Store agent's message in the database
    const [newMessage] = await db.insert(messages).values({
      conversationId: conversationId,
      role: 'assistant', // From business perspective, it's an assistant/agent
      content: content,
      createdAt: new Date(),
    }).returning();

    // Update conversation's last message time
    await db.update(conversations).set({ lastMessageAt: new Date() }).where(eq(conversations.id, conversationId));

    return newMessage;
  }, {
    body: t.Object({ content: t.String() })
  })

  // POST /api/inbox/conversations/:id/toggle-bot - Enables or disables the bot
  .post('/conversations/:id/toggle-bot', async ({ params, body }) => {
    const conversationId = parseInt(params.id, 10);
    const { botStatus } = body as { botStatus: boolean };

    const [updatedConversation] = await db.update(conversations)
      .set({ botStatus: botStatus })
      .where(eq(conversations.id, conversationId))
      .returning();
      
    if (!updatedConversation) {
      return new Response('Conversation not found', { status: 404 });
    }

    return updatedConversation;
  }, {
    body: t.Object({ botStatus: t.Boolean() })
  });
