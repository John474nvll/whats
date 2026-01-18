
import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

if (!accountSid || !authToken) {
  throw new Error('Twilio credentials are not set in environment variables');
}

const client = twilio(accountSid, authToken);

/**
 * Generates a TwiML response to say a message to the user.
 * @param message The text message to be spoken.
 * @returns The TwiML string.
 */
export function createVoiceResponse(message: string): string {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.say(message);
  return twiml.toString();
}

/**
 * Makes an outbound call.
 * @param to The phone number to call.
 * @param from The Twilio phone number to use.
 * @param url The URL for TwiML instructions.
 */
export async function makeCall(to: string, from: string, url: string) {
  try {
    const call = await client.calls.create({
      to,
      from,
      url,
    });
    console.log(`Call initiated with SID: ${call.sid}`);
    return call;
  } catch (error) {
    console.error('Failed to make call:', error);
    throw error;
  }
}
