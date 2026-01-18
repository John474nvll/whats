
import { Elysia } from 'elysia';
import { db } from '../db';
import { contacts, conversations, messages } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { sendWhatsAppMessage } from '../services/whatsapp';
import { generateResponse } from '../services/aiOrchestrator';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export const whatsappRoutes = new Elysia({ prefix: '/whatsapp' })
  // Verification endpoint for WhatsApp webhook setup
  .get('/webhook', ({ query }) => {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully!');
      return challenge;
    } else {
      console.error('Webhook verification failed. Tokens do not match.');
      return new Response('Forbidden', { status: 403 });
    }
  })
  // Message handling endpoint
  .post('/webhook', async ({ body }: { body: any }) => {
    console.log('Incoming WhatsApp payload:', JSON.stringify(body, null, 2));

    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];
    if (!message || message.type !== 'text') {
      // We are only handling text messages for now.
      return new Response('OK', { status: 200 });
    }

    const from = message.from; // Sender's phone number
    const msgBody = message.text.body; // Message content

    try {
      // 1. Find or create the contact
      let [contact] = await db.select().from(contacts).where(eq(contacts.phone, from));
      if (!contact) {
        console.log(`Creating new contact for ${from}`);
        [contact] = await db.insert(contacts).values({ name: `WhatsApp User ${from}`, phone: from, platform: 'whatsapp' }).returning();
      }

      // 2. Find or create the conversation
      let [conversation] = await db.select().from(conversations).where(eq(conversations.contactId, contact.id));
      if (!conversation) {
        console.log(`Creating new conversation for contact ${contact.id}`);
        [conversation] = await db.insert(conversations).values({ contactId: contact.id, status: 'open', botStatus: true }).returning();
      }
      
      // Store incoming user message
      await db.insert(messages).values({
        conversationId: conversation.id,
        role: 'user',
        content: msgBody,
        createdAt: new Date(),
      });

      // 3. Handle "AGENTE" keyword to pause the bot
      if (msgBody.trim().toUpperCase() === 'AGENTE') {
        if (conversation.botStatus) { // Only act if the bot is currently active
          console.log(`Pausing bot for conversation ${conversation.id}`);
          await db.update(conversations).set({ botStatus: false }).where(eq(conversations.id, conversation.id));
          const agentMessage = 'He pausado el bot. Un agente humano se pondrá en contacto contigo en breve.';
          await sendWhatsAppMessage(from, agentMessage);
          // Store the confirmation message in the history
          await db.insert(messages).values({
              conversationId: conversation.id,
              role: 'assistant',
              content: agentMessage,
              createdAt: new Date(),
          });
        }
        return new Response('OK', { status: 200 }); // Exit after handling the agent request
      }

      // 4. Check if bot is paused for this conversation
      if (!conversation.botStatus) {
        console.log(`Bot is paused for conversation ${conversation.id}. Ignoring message.`);
        return new Response('OK', { status: 200 }); // Do nothing if bot is paused
      }

      // 5. If bot is active, generate and send AI response
      console.log(`Generating AI response for conversation ${conversation.id}`);
      const history = await db.select({ content: messages.content, sender: messages.role })
          .from(messages)
          .where(eq(messages.conversationId, conversation.id))
          .orderBy(messages.createdAt)
          .limit(10);

      const aiResponse = await generateResponse(msgBody, history);
      
      // 6. Send the AI response and store it in the database
      await sendWhatsAppMessage(from, aiResponse);
      await db.insert(messages).values({
        conversationId: conversation.id,
        role: 'assistant',
        content: aiResponse,
        createdAt: new Date(),
      });

    } catch (error) {
      console.error('Error processing WhatsApp message:', error);
      // Respond with 200 OK even if an error occurs to prevent webhook retries
    }
    
    return new Response('OK', { status: 200 });
  });
