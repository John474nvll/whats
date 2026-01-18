
import { Elysia, t } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { usersRoutes } from './routes/users';
import { contactsRoutes } from './routes/contacts';
import { companiesRoutes } from './routes/companies';
import { sendWhatsAppMessage } from './services/whatsapp';
import { createVoiceResponse } from './services/twilio';

const prisma = new PrismaClient();
const app = new Elysia();

// Helper to find or create a user and conversation
async function getConversation(contact: any) {
  const waId = contact.wa_id;
  const name = contact.profile.name;

  let user = await prisma.user.findUnique({
    where: { phoneNumber: waId },
  });

  if (!user) {
    user = await prisma.user.create({
      data: {
        phoneNumber: waId,
        name: name,
      },
    });
  }

  let conversation = await prisma.conversation.findFirst({
    where: { userId: user.id },
  });

  if (!conversation) {
    conversation = await prisma.conversation.create({
      data: {
        userId: user.id,
      },
    });
  }

  return conversation;
}

// Webhook for Twilio Voice
app.post('/voice', ({ set }) => {
  const welcomeMessage = 'Hello! Thank you for calling. We will connect you to an agent shortly.';
  const twimlResponse = createVoiceResponse(welcomeMessage);
  
  set.headers['Content-Type'] = 'application/xml';
  set.status = 200;
  return twimlResponse;
});


// Webhook for WhatsApp
app.post('/webhook', async ({ body, set }) => {
  const webhookBody = body as any;

  // Log the incoming webhook
  console.log('Received webhook:', JSON.stringify(webhookBody, null, 2));

  if (webhookBody.object === 'whatsapp_business_account') {
    for (const entry of webhookBody.entry) {
      for (const change of entry.changes) {
        if (change.field === 'messages') {
          const value = change.value;
          
          // Check if messages and contacts exist
          if (value.messages && value.contacts) {
            const contact = value.contacts[0];
            const message = value.messages[0];

            if (message.type === 'text') {
              const conversation = await getConversation(contact);

              // Store incoming message
              await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  sender: 'user',
                  content: message.text.body,
                },
              });

              // Echo the message back
              const replyMessage = `You said: \"${message.text.body}\"`;
              await sendWhatsAppMessage(contact.wa_id, replyMessage);
              
              // Store bot's reply
              await prisma.message.create({
                data: {
                  conversationId: conversation.id,
                  sender: 'bot',
                  content: replyMessage,
                },
              });
            }
          }
        }
      }
    }
  }
  
  set.status = 200;
  return 'OK';
})
.get('/webhook', ({ query, set }) => {
    const mode = query['hub.mode'];
    const challenge = query['hub.challenge'];
    const token = query['hub.verify_token'];

    const WHATSAPP_VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

    if (mode === 'subscribe' && token === WHATSAPP_VERIFY_TOKEN) {
        console.log('Webhook verified');
        set.status = 200;
        return challenge;
    } else {
        console.error('Webhook verification failed');
        set.status = 403;
        return 'Forbidden';
    }
});


// Agrupa las rutas de la API bajo el prefijo /api
app.group('/api', (app) => 
  app
    .use(usersRoutes)
    .use(contactsRoutes)
    .use(companiesRoutes)
);

// Inicia el servidor
app.listen(3000, () => {
  console.log(`ðŸ¦Š Elysia is running at http://${app.server?.hostname}:${app.server?.port}`);
});
