
import type { Express } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: Replace with a real authentication system
const TEMP_USER_ID = 1;

// In-memory storage for verification codes is acceptable as it's short-lived.
let verificationCodes: Record<string, string> = {};

/**
 * Simulates validating a Meta (Facebook/Instagram) access token.
 * In a real application, this would involve making a call to Meta's Graph API.
 * @param accessToken The token provided by the user.
 * @returns A simulated object with a fake user ID if the token is "valid".
 */
async function validateMetaToken(accessToken: string): Promise<{ isValid: boolean; accountId?: string }> {
  console.log(`Simulating validation for token: ${accessToken.substring(0, 10)}...`);
  // TODO: Implement real token validation with Meta's Graph API.
  // Example: `https://graph.facebook.com/me?access_token=${accessToken}`
  if (accessToken && accessToken.length > 10) {
    // Simulate a successful validation and return a fake, but consistent, account ID.
    return { isValid: true, accountId: `meta_acc_${Date.now()}` };
  } else {
    return { isValid: false };
  }
}

export function registerPlatformRoutes(app: Express) {

  // --- Platform Account Routes (DB Connected) ---

  app.get('/api/platforms/accounts', async (req, res) => {
    try {
      const accounts = await prisma.platformAccount.findMany({
        where: { userId: TEMP_USER_ID },
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching platform accounts', error });
    }
  });

  app.post('/api/platforms/connect', async (req, res) => {
    const { platform, accessToken, accountName } = req.body;

    if (!['instagram', 'facebook'].includes(platform) || !accessToken || !accountName) {
      return res.status(400).json({ message: 'Platform, access token, and account name are required' });
    }

    try {
      // 1. (Simulate) Validate the token with the platform's API
      const { isValid, accountId } = await validateMetaToken(accessToken);

      if (!isValid) {
        return res.status(401).json({ message: 'Invalid or expired access token' });
      }

      // 2. Create or update the account in the database
      // Using upsert is smart: it updates the token if the account already exists.
      const account = await prisma.platformAccount.upsert({
        where: {
          // A unique identifier for the account should be used here.
          // For this simulation, we'll use the combination of platform and name.
          // In a real scenario, the platform-provided accountId would be ideal.
          userId_platform_accountName: { // This is a composite key I'll need to add to the schema
            userId: TEMP_USER_ID,
            platform,
            accountName,
          }
        },
        update: { accessToken }, // Just update the token if it exists
        create: {
          platform,
          accessToken, // In a real app, this should be encrypted
          accountName,
          accountId: accountId, // The ID from the platform itself
          userId: TEMP_USER_ID,
        },
      });

      res.status(201).json(account);
    } catch (error: any) {
        // Catch potential unique constraint errors if the composite key isn't set up
        if (error.code === 'P2002') {
             return res.status(409).json({ message: 'This account is already connected.' });
        }
      res.status(500).json({ message: 'Failed to connect account', error });
    }
  });

  // --- Channel / Phone Verification Routes (Kept for next steps) ---

  app.post('/api/platforms/send-phone-code', (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Phone number is required' });
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[phoneNumber] = code;
    console.log(`Verification code for ${phoneNumber}: ${code}`); // Simulate sending SMS
    res.json({ success: true, message: 'Verification code sent' });
  });

  app.post('/api/platforms/verify-phone-code', async (req, res) => {
    const { phoneNumber, code } = req.body;
    if (verificationCodes[phoneNumber] !== code) {
      return res.status(400).json({ success: false, message: 'Invalid verification code' });
    }

    try {
      const newChannel = await prisma.channel.create({
        data: {
          platform: 'whatsapp', // Hardcoded for this flow
          phoneNumberId: phoneNumber,
          isActive: true,
          userId: TEMP_USER_ID,
        }
      });
      delete verificationCodes[phoneNumber]; // Clean up used code
      res.status(201).json({ success: true, channel: newChannel });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Failed to create channel', error });
    }
  });

  // --- Generic Message Sending (Simulation - to be replaced) ---
  app.post('/api/platforms/send-message', (req, res) => {
    const { platform, to, content } = req.body;
    console.log(`Simulating sending message via ${platform} to ${to}: "${content}"`);
    res.json({ success: true, messageId: `sim_msg_${Date.now()}` });
  });
}
