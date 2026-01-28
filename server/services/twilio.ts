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
  private client: twilio.Twilio;
  
  private constructor() {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const apiKey = process.env.TWILIO_API_KEY;
    const apiSecret = process.env.TWILIO_API_SECRET;

    if (!accountSid || !apiKey || !apiSecret) {
      throw new TwilioCredentialsError('Twilio credentials are not fully configured.');
    }
    // The Twilio constructor uses apiKey and apiSecret for auth
    this.client = twilio(apiKey, apiSecret, { accountSid });
  }

  public static getInstance(): RealTwilioService {
    if (!RealTwilioService.instance) {
      RealTwilioService.instance = new RealTwilioService();
    }
    return RealTwilioService.instance;
  }
  
  generateAccessToken(identity: string): { identity: string; token: string } {
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
  // Use the real service only in production
  if (process.env.NODE_ENV === 'production') {
    return RealTwilioService.getInstance();
  }
  // Otherwise, use the mock service to avoid credential validation issues
  return new MockTwilioService();
}

// Export a single instance of the service, which will be either the real or mock one.
export const twilioService = createTwilioService();
