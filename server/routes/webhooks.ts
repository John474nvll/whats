
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { api } from '@shared/routes';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const webhooksRouter = Router();

// Get this from your Facebook App Dashboard
const META_VERIFY_TOKEN = process.env.META_VERIFY_TOKEN || 'socialhub';

// Meta Webhook Verification
webhooksRouter.get(api.webhooks.metaVerify.path, (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === META_VERIFY_TOKEN) {
    console.log("Webhook verified successfully!");
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// Meta Webhook - Handle Incoming Messages
webhooksRouter.post(api.webhooks.meta.path, async (req, res) => {
  const { object, entry } = req.body;

  if (object === 'page') {
    for (const item of entry) {
      for (const change of item.changes) {
        if (change.field === 'messages') {
          const messageData = change.value.messages[0];
          const contactData = change.value.contacts[0];

          if (messageData.type === 'text') {
            try {
              // Find or create the contact
              const contact = await prisma.contact.upsert({
                where: { platform_platformId: { platform: 'whatsapp', platformId: contactData.wa_id } },
                update: { name: contactData.profile.name },
                create: {
                  platform: 'whatsapp',
                  platformId: contactData.wa_id,
                  name: contactData.profile.name,
                  userId: 1, // TODO: This should be dynamic
                }
              });

              // Find or create the conversation
              let conversation = await prisma.conversation.findFirst({
                  where: { contactId: contact.id }
              });
              if (!conversation) {
                  conversation = await prisma.conversation.create({
                      data: { contactId: contact.id, channel: 'whatsapp', status: 'open' }
                  });
              }

              // Save the incoming message
              await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  content: messageData.text.body,
                  role: 'contact',
                  sentiment: 'neutral' // Placeholder
                }
              });

              console.log(`Saved message from ${contact.name}: ${messageData.text.body}`);

            } catch (error) {
              console.error("Error processing incoming message:", error);
            }
          }
        }
      }
    }
  }

  res.sendStatus(200); // Acknowledge receipt of the event
});

export default webhooksRouter;
