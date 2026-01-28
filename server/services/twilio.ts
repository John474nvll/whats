import twilio from 'twilio';

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || "";
const TWILIO_API_KEY = process.env.TWILIO_API_KEY || "";
const TWILIO_API_SECRET = process.env.TWILIO_API_SECRET || "";
const TWILIO_APP_SID = process.env.TWILIO_APP_SID || "";
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || "";

export class TwilioCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TwilioCredentialsError';
  }
}

class TwilioService {
  private static instance: TwilioService;
  private client: twilio.Twilio;

  private constructor() {
    if (!TWILIO_ACCOUNT_SID || !TWILIO_API_KEY || !TWILIO_API_SECRET) {
      throw new TwilioCredentialsError('Twilio credentials are not fully configured in environment variables.');
    }
    this.client = twilio(TWILIO_ACCOUNT_SID, TWILIO_API_SECRET, { accountSid: TWILIO_ACCOUNT_SID });
  }

  public static getInstance(): TwilioService {
    if (!TwilioService.instance) {
      TwilioService.instance = new TwilioService();
    }
    return TwilioService.instance;
  }

  generateAccessToken(identity: string) {
    if (!TWILIO_APP_SID) {
      throw new TwilioCredentialsError('Twilio App SID is not configured.');
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
    if (!TWILIO_PHONE_NUMBER) {
      throw new TwilioCredentialsError('Twilio Phone Number is not configured.');
    }

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
    // The client name is hardcoded to 'support-agent' as this is the only client that can receive calls.
    voiceResponse.dial().client({}, 'support-agent');
    return voiceResponse.toString();
  }

  getStatus() {
      return {
          configured: !!(TWILIO_ACCOUNT_SID && TWILIO_API_KEY && TWILIO_API_SECRET),
          hasPhoneNumber: !!TWILIO_PHONE_NUMBER,
          hasAppSid: !!TWILIO_APP_SID
      }
  }
}

export const twilioService = TwilioService.getInstance();
