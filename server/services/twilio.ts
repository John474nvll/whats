import twilio from 'twilio';

// Custom error for credential issues
export class TwilioCredentialsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TwilioCredentialsError';
  }
}

// Interface for our service to ensure both real and mock services have the same methods.
interface ITwilioService {
  generateAccessToken(identity: string): { identity: string; token: string };
  getVoiceResponse(to: string): string;
  getIncomingCallResponse(): string;
  getStatus(): { configured: boolean; hasPhoneNumber: boolean; hasAppSid: boolean };
}

// --- Real Twilio Service (for production) ---
class RealTwilioService implements ITwilioService {
  private static instance: RealTwilioService;
  private client: twilio.Twilio | undefined;

  private constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (!accountSid || !apiKey || !apiSecret) {
      console.warn('Twilio credentials are not fully configured. The real Twilio service will not be available.');
      this.client = undefined;
    } else {
      // The Twilio constructor uses apiKey and apiSecret for auth
      this.client = twilio(apiKey, apiSecret, { accountSid });
    }
  }

  public static getInstance(): RealTwilioService {
    if (!RealTwilioService.instance) {
      RealTwilioService.instance = new RealTwilioService();
    }
    return RealTwilioService.instance;
  }

  generateAccessToken(identity: string): { identity: string; token: string } {
    if (!this.client) {
        throw new TwilioCredentialsError('Twilio client is not initialized.');
    }
    const appSid = process.env.TWILIO_APP_SID;
    if (!appSid) {
      throw new TwilioCredentialsError('Twilio App SID is not configured.');
    }

    const AccessToken = twilio.jwt.AccessToken;
    const { VoiceGrant } = AccessToken;

    const voiceGrant = new VoiceGrant({
      outgoingApplicationSid: appSid,
      incomingAllow: true,
    });

    const token = new AccessToken(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_API_KEY!,
      process.env.TWILIO_API_SECRET!,
      { identity },
    );
    token.addGrant(voiceGrant);

    return {
      identity: identity,
      token: token.toJwt(),
    };
  }

  getVoiceResponse(to: string): string {
    if (!this.client) {
        throw new TwilioCredentialsError('Twilio client is not initialized.');
    }
    const phoneNumber = process.env.TWILIO_PHONE_NUMBER;
    if (!phoneNumber) {
      throw new TwilioCredentialsError('Twilio Phone Number is not configured.');
    }

    const voiceResponse = new twilio.twiml.VoiceResponse();
    const dial = voiceResponse.dial({ callerId: phoneNumber });
    dial.number({}, to);
    return voiceResponse.toString();
  }

  getIncomingCallResponse(): string {
    if (!this.client) {
        throw new TwilioCredentialsError('Twilio client is not initialized.');
    }
    const voiceResponse = new twilio.twiml.VoiceResponse();
    voiceResponse.say(
      { voice: 'alice', language: 'es-MX' },
      'Bienvenido a SocialHub. Un momento por favor.',
    );
    voiceResponse.dial().client({}, 'support-agent');
    return voiceResponse.toString();
  }

  getStatus(): { configured: boolean; hasPhoneNumber: boolean; hasAppSid: boolean } {
    return {
      configured: !!(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_API_KEY && process.env.TWILIO_API_SECRET),
      hasPhoneNumber: !!process.env.TWILIO_PHONE_NUMBER,
      hasAppSid: !!process.env.TWILIO_APP_SID,
    };
  }
}

// --- Mock Twilio Service (for development) ---
class MockTwilioService implements ITwilioService {
  generateAccessToken(identity: string): { identity: string; token: string } {
    console.log('MockTwilioService: generateAccessToken called');
    return {
      identity,
      token: 'mock_jwt_token_for_development',
    };
  }

  getVoiceResponse(to: string): string {
    console.log(`MockTwilioService: getVoiceResponse called for ${to}`);
    // We need to use the real twilio package to create a valid TwiML response
    const voiceResponse = new twilio.twiml.VoiceResponse();
    voiceResponse.say('This is a mock voice response from the development server.');
    return voiceResponse.toString();
  }
  
  getIncomingCallResponse(): string {
    console.log('MockTwilioService: getIncomingCallResponse called');
    const voiceResponse = new twilio.twiml.VoiceResponse();
    voiceResponse.say('This is a mock incoming call response from the development server.');
    return voiceResponse.toString();
  }

  getStatus(): { configured: boolean; hasPhoneNumber: boolean; hasAppSid: boolean } {
    console.log('MockTwilioService: getStatus called');
    return {
      configured: false,
      hasPhoneNumber: false,
      hasAppSid: false,
    };
  }
}

// --- Service Factory ---
function createTwilioService(): ITwilioService {
  if (process.env.NODE_ENV !== 'production') {
    console.log("Using Mock Twilio Service");
    return new MockTwilioService();
  }
  console.log("Using Real Twilio Service");
  return RealTwilioService.getInstance();
}

// Export a single instance of the service, which will be either the real or mock one.
export const twilioService = createTwilioService();