
import { Router } from 'express';
import { db } from '../db';
import { campaigns, customers, socialAccounts } from '@shared/schema';
import { sendWhatsAppMessage, publishToInstagram, publishToFacebook } from '../services/social-publisher';
import { eq, inArray } from 'drizzle-orm';

const router = Router();

router.post('/', async (req, res) => {
  const { content, targetAccountIds, platform } = req.body;

  if (!content || !targetAccountIds || !platform) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const newCampaign = await db.insert(campaigns).values({
      name: `Campaign ${new Date().toISOString()}`,
      content,
      platform,
      status: 'sending',
      userId: '1', // Replace with actual user ID from auth
    }).returning();

    const accounts = await db.select().from(socialAccounts).where(inArray(socialAccounts.id, targetAccountIds));
    const allCustomers = await db.select().from(customers);

    for (const account of accounts) {
      for (const customer of allCustomers) {
        if (customer.phone) {
          if (account.platform === 'whatsapp') {
            await sendWhatsAppMessage(account.accessToken, account.id.toString(), customer.phone, content);
          }
        }
        if (account.platform === 'instagram') {
          // Instagram requires an image, so this will be a simplified version
          await publishToInstagram(account.accessToken, account.id.toString(), { content });
        }
        if (account.platform === 'facebook') {
          await publishToFacebook(account.accessToken, account.id.toString(), { content });
        }
      }
    }

    await db.update(campaigns).set({ status: 'sent' }).where(eq(campaigns.id, newCampaign[0].id));

    res.status(201).json(newCampaign[0]);
  } catch (error) {
    console.error('Failed to create campaign:', error);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
});

router.get('/', async (req, res) => {
  try {
    const allCampaigns = await db.select().from(campaigns);
    res.json(allCampaigns);
  } catch (error) {
    console.error('Failed to fetch campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
});

router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  try {
    await db.delete(campaigns).where(eq(campaigns.id, id));
    res.json({ message: 'Campaign deleted successfully' });
  } catch (error) {
    console.error('Failed to delete campaign:', error);
    res.status(500).json({ error: 'Failed to delete campaign' });
  }
});

export default router;
