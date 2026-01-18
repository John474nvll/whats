
import { Elysia } from 'elysia';
import { aiOrchestrator } from '../services/aiOrchestrator';

const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

export const whatsappRoutes = new Elysia()
  .get('/whatsapp/webhook', ({ query }) => {
    const mode = query['hub.mode'];
    const token = query['hub.verify_token'];
    const challenge = query['hub.challenge'];

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified');
      return challenge;
    } else {
      console.error('Failed validation. Make sure the validation tokens match.');
      return new Response('Forbidden', { status: 403 });
    }
  })
  .post('/whatsapp/webhook', async ({ body }: { body: any }) => {
    console.log('Incoming WhatsApp payload:', JSON.stringify(body, null, 2));

    // Procesa solo si es un mensaje de texto
    const message = body?.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (message && message.type === 'text') {
      const from = message.from; // Número de teléfono del remitente
      const msgBody = message.text.body; // Contenido del mensaje

      console.log(`Processing message from ${from}: "${msgBody}"`);
      // Pasa el mensaje al orquestador de IA para que lo maneje
      // No es necesario esperar (await) aquí, puede ejecutarse en segundo plano
      aiOrchestrator.handleIncomingMessage(from, msgBody);
    }

    // Responde inmediatamente a la solicitud del webhook con un 200 OK
    return new Response('OK', { status: 200 });
  });
