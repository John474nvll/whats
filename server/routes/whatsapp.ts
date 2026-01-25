
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import twilio from 'twilio';
import pLimit from 'p-limit';
import dotenv from 'dotenv';

dotenv.config();
const prisma = new PrismaClient();
const whatsappRouter = Router();

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio credentials are not set for the bulk message sender.");
}

const client = twilio(accountSid, authToken);

// Set a concurrency limit to avoid hitting rate limits
const limit = pLimit(10); // Limit to 10 concurrent messages

// Route to send a bulk message to all WhatsApp contacts
whatsappRouter.post('/bulk', async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ message: "A 'message' body is required." });
  }

  if (!client || !twilioPhoneNumber) {
    return res.status(500).json({ message: "Twilio client is not initialized." });
  }

  try {
    // 1. Fetch all WhatsApp contacts
    const contacts = await prisma.contact.findMany({
      where: { platform: 'whatsapp' },
    });

    if (contacts.length === 0) {
      return res.status(404).json({ message: "No WhatsApp contacts found." });
    }

    // 2. Create message-sending promises
    const messagePromises = contacts.map(contact => {
      return limit(() => 
        client.messages.create({
          body: message,
          from: `whatsapp:${twilioPhoneNumber.replace(/\D/g, '')}`,
          to: `whatsapp:${contact.platformId}`
        })
        .then(msg => ({ status: 'success', sid: msg.sid, to: contact.platformId }))
        .catch(err => ({ status: 'failed', error: err.message, to: contact.platformId }))
      );
    });

    // 3. Execute all promises
    const results = await Promise.all(messagePromises);

    const successfulSends = results.filter(r => r.status === 'success').length;
    const failedSends = results.filter(r => r.status === 'failed').length;

    console.log(`Bulk messaging complete. Success: ${successfulSends}, Failed: ${failedSends}`);

    res.json({
      message: 'Bulk messaging process completed.',
      totalContacts: contacts.length,
      successfulSends,
      failedSends,
      results
    });

  } catch (error) {
    console.error("Error during bulk message sending:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default whatsappRouter;
