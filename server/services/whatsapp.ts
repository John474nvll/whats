
import axios from 'axios';

const WHATSAPP_ACCESS_TOKEN = process.env.WHATSAPP_ACCESS_TOKEN;
const WHATSAPP_BUSINESS_PHONE_ID = process.env.WHATSAPP_BUSINESS_PHONE_ID;

export async function sendWhatsAppMessage(to: string, message: string) {
  if (!WHATSAPP_ACCESS_TOKEN || !WHATSAPP_BUSINESS_PHONE_ID) {
    console.error('WhatsApp credentials are not configured.');
    return;
  }

  try {
    await axios.post(
      `https://graph.facebook.com/v18.0/${WHATSAPP_BUSINESS_PHONE_ID}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: message },
      },
      {
        headers: {
          'Authorization': `Bearer ${WHATSAPP_ACCESS_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(`Message sent to ${to}: "${message}"`);
  } catch (error: any) {
    console.error('Error sending WhatsApp message:', error.response?.data || error.message);
  }
}
