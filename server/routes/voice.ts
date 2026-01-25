
import { Router } from 'express';
import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

const voiceRouter = Router();

// Initialize Twilio Client
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Validate that credentials are set
if (!accountSid || !authToken || !twilioPhoneNumber) {
  console.error("Twilio credentials are not set in the .env file.");
  // In a real app, you might want to prevent the server from starting
} else {
  console.log("Twilio client initialized successfully.");
}

const client = twilio(accountSid, authToken);

// Route to initiate a call
voiceRouter.post('/call', async (req, res) => {
  const { to } = req.body;

  if (!to) {
    return res.status(400).json({ message: "'to' phone number is required." });
  }

  if (!client || !twilioPhoneNumber) {
      return res.status(500).json({ message: "Twilio client is not initialized." });
  }

  try {
    const call = await client.calls.create({
      url: 'http://demo.twilio.com/docs/voice.xml', // A simple TwiML for the demo
      to: to,
      from: twilioPhoneNumber,
    });
    console.log(`Call initiated with SID: ${call.sid}`);
    res.json({ message: "Call initiated successfully", callSid: call.sid });
  } catch (error) {
    console.error("Error initiating call:", error);
    res.status(500).json({ message: "Failed to initiate call." });
  }
});

export default voiceRouter;
