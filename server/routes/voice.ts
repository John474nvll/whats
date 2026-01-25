
import { Twilio } from 'twilio';
import { Router } from 'express';

// Initialize Twilio Client
// Ensure TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN are in your .env file
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = new Twilio(accountSid, authToken);

const voiceRouter = Router();

/**
 * @route POST /api/voice/call
 * @description Initiates an outbound call and says a message using Twilio's TTS.
 * @body { to: string, message: string, from: string }
 * @- to: The destination phone number (e.g., '+573001234567')
 * @- message: The text to be spoken to the recipient.
 * @- from: Your Twilio phone number (e.g., '+15017122661')
 */
voiceRouter.post('/call', async (req, res) => {
  const { to, message, from } = req.body;

  if (!to || !message || !from) {
    return res.status(400).json({ message: 'Missing required fields: to, message, from' });
  }

  try {
    // Use TwiML for dynamic response
    const twiml = `<?xml version="1.0" encoding="UTF-8"?><Response><Say voice="alice" language="es-MX">${message}</Say></Response>`;

    const call = await client.calls.create({
      twiml: twiml,
      to: to,
      from: from,
    });

    console.log(`Call initiated with SID: ${call.sid}`);
    res.status(200).json({ success: true, message: 'Call initiated successfully.', callSid: call.sid });

  } catch (error) {
    console.error('Twilio call failed:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate call.', error });
  }
});

/**
 * @route POST /api/voice/retell-call
 * @description Initiates an outbound call and connects to a Retell AI agent (or any other voice webhook).
 * @body { to: string, from: string, retell_agent_url: string }
 */
voiceRouter.post('/retell-call', async (req, res) => {
  const { to, from, retell_agent_url } = req.body;

  if (!to || !from || !retell_agent_url) {
    return res.status(400).json({ message: 'Missing required fields: to, from, retell_agent_url' });
  }

  try {
    const call = await client.calls.create({
      url: retell_agent_url, // This URL should point to your Retell agent's endpoint
      to: to,
      from: from,
    });

    console.log(`Retell AI call initiated with SID: ${call.sid}`);
    res.status(200).json({ success: true, message: 'Retell AI call initiated.', callSid: call.sid });

  } catch (error) {
    console.error('Retell AI call failed:', error);
    res.status(500).json({ success: false, message: 'Failed to initiate Retell AI call.', error });
  }
});

export default voiceRouter;
