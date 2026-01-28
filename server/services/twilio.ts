import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || "";
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || "";
const TWILIO_APP_SID = process.env.TWILIO_APP_SID || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

class TwilioService {
  private client: twilio.Twilio;

  constructor() {
    if (TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_SECRET) {
      this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_API_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
    } else {
      console.log("Twilio credentials not fully configured.");
    }
  }

  isConfigured() {
    return !!(TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_SECRET && TWILIO_APP_SID && TWILIO_PHONE_NUMBER);
  }

  generateAccessToken(identity: string) {
    if (!this.isConfigured()) {
      return null;
    }
    const AccessToken = twilio.jwt.AccessToken;
    const { VoiceGrant } = AccessToken;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: TWILIO_APP_SID,
      incomingAllow: true,
    });

    const token = new AccessToken(
      TWILIO_ACCOUNT_SID,
      TWILIO_API_KEY,
      TWILIO_API_SECRET,
      { identity }
    );
    token.addGrant(voiceGrant);

    return {
      identity: identity,
      token: token.toJwt(),
    };
  }

  getVoiceResponse(to: string) {
    const voiceResponse = new twilio.twiml.VoiceResponse();
    const dial = voiceResponse.dial({
      callerId: TWILIO_PHONE_NUMBER,
    });
    dial.number({}, to);
    return voiceResponse.toString();
  }

  getIncomingCallResponse() {
    const voiceResponse = new twilio.twiml.VoiceResponse();
    voiceResponse.say({ voice: 'alice', language: 'es-MX' }, 'Bienvenido a SocialHub. Un momento por favor.');
    voiceResponse.dial().client({}, 'support-agent');
    return voiceResponse.toString();
  }

  getStatus() {
      return {
          configured: !!(TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_SECRET),
          hasPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER,
          hasAppSid: !!TWILIO_APP_SID
      }
  }
}

export const twilioService = new TwilioService();