
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const conversationsRouter = Router();

// TODO: Replace with real user authentication
const TEMP_USER_ID = 1;

/**
 * SIMULATED PLATFORM API SENDER
 * In a real-world scenario, this function would interact with the specific platform APIs
 * (e.g., Meta's Graph API for Instagram/Facebook, Twilio for WhatsApp) to send a message.
 * @param platform The platform to send the message to (e.g., "instagram").
 * @param accessToken The token for the platform account.
 * @param recipientId The platform-specific ID of the recipient.
 * @param content The message content.
 */
async function sendMessageWithPlatformApi(platform: string, accessToken: string, recipientId: string, content: string) {
  console.log('\n--- SIMULATING MESSAGE SEND ---');
  console.log(`Platform: ${platform}`);
  console.log(`Recipient ID: ${recipientId}`);
  console.log(`Content: "${content}"`);
  console.log(`Using Token: ${accessToken.substring(0, 15)}...`);
  console.log('-----------------------------\n');

  // TODO: Implement actual API calls here based on the platform.
  // if (platform === 'instagram') { ... call Meta API ... }
  // if (platform === 'whatsapp') { ... call Twilio/Meta API ... }

  // Simulate a successful API call
  return { success: true, messageId: `sim_${platform}_${Date.now()}` };
}

// GET all conversations for the user
conversationsRouter.get('/', async (req, res) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: {
        // In the future, this should be filtered by the authenticated user
      },
      include: {
        contact: true, // Include contact details
        channel: true, // Include channel details
      },
      orderBy: {
        lastMessageAt: 'desc',
      },
    });
    res.json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ message: "Error fetching conversations" });
  }
});

// POST a new message to a conversation
conversationsRouter.post('/:conversationId/messages', async (req, res) => {
  const { conversationId } = req.params;
  const { content } = req.body;

  if (!content) {
    return res.status(400).json({ message: 'Message content is required' });
  }

  try {
    // 1. Find the conversation and its related channel and contact
    const conversation = await prisma.conversation.findUnique({
      where: { id: parseInt(conversationId) },
      include: { channel: true, contact: true },
    });

    if (!conversation) {
      return res.status(404).json({ message: 'Conversation not found' });
    }

    // 2. Find the platform account to get the access token
    const platformAccount = await prisma.platformAccount.findFirst({
        where: {
            platform: conversation.channel.platform,
            userId: TEMP_USER_ID, // Should be authenticated user
        }
    });

    if (!platformAccount || !platformAccount.accessToken) {
        return res.status(400).json({ message: `No connected account found for ${conversation.channel.platform} to send message.` });
    }

    // 3. (Simulate) Send the message using the platform's API
    // The recipient ID would be stored in the contact model (e.g., contact.platformSpecificId)
    // For now, we'll simulate it with the contact's phone or email
    const recipientId = conversation.contact.phone || conversation.contact.email || ''
    if(!recipientId) {
        return res.status(400).json({ message: "Contact does not have a valid ID (phone/email) to receive a message." });
    }

    const platformApiResult = await sendMessageWithPlatformApi(
      conversation.channel.platform,
      platformAccount.accessToken,
      recipientId,
      content
    );

    if (!platformApiResult.success) {
      return res.status(500).json({ message: 'Failed to send message via platform API' });
    }

    // 4. Save the new message to our database
    const newMessage = await prisma.message.create({
      data: {
        content,
        role: 'assistant', // Messages sent from the app are from the 'assistant'
        conversationId: parseInt(conversationId),
      },
    });

    // 5. Update the `lastMessageAt` timestamp on the conversation
    await prisma.conversation.update({
        where: { id: parseInt(conversationId) },
        data: { lastMessageAt: new Date() },
    });

    res.status(201).json(newMessage);

  } catch (error) {
    console.error(`Error sending message for conversation ${conversationId}:`, error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default conversationsRouter;
