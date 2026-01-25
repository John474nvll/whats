
import type { Express } from "express";
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TODO: Replace with a real authentication system
const TEMP_USER_ID = 1;

// In-memory storage for verification codes is acceptable as it's short-lived.
let verificationCodes: Record<string, string> = {};

export function registerPlatformRoutes(app: Express) {

  // --- Social Account Routes (DB Connected) ---

  app.get('/api/platforms/accounts', async (req, res) => {
    try {
      const accounts = await prisma.socialAccount.findMany({
        where: { userId: TEMP_USER_ID },
      });
      res.json(accounts);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching social accounts', error });
    }
  });

  app.post('/api/platforms/connect', async (req, res) => {
    try {
      const { platform, accessToken, username } = req.body;
      if (!['instagram', 'facebook', 'whatsapp'].includes(platform) || !accessToken) {
        return res.status(400).json({ message: 'Invalid platform or access token' });
      }
      const newAccount = await prisma.socialAccount.create({
        data: {
          platform,
          accessToken,
          username: username || `${platform}-user`,
          userId: TEMP_USER_ID,
        },
      });
      res.status(201).json(newAccount);
    } catch (error) {
      res.status(500).json({ message: 'Failed to connect account', error });
    }
  });

  // --- Channel / Phone Verification Routes (DB Connected) ---

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

  app.get('/api/platforms/phone-accounts', async (req, res) => {
    try {
      const channels = await prisma.channel.findMany({
        where: { 
          userId: TEMP_USER_ID,
          platform: 'whatsapp' 
        },
      });
      res.json(channels);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching phone accounts', error });
    }
  });

  // --- Generic Message Sending (Simulation) ---
  app.post('/api/platforms/send-message', (req, res) => {
    const { platform, to, content } = req.body;
    console.log(`Simulating sending message via ${platform} to ${to}: "${content}"`);
    res.json({ success: true, messageId: `sim_msg_${Date.now()}` });
  });
}
