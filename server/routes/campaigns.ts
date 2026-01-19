import { Elysia } from 'elysia';
import { db } from '../db';
import { campaigns, customers, socialAccounts } from '@shared/schema';
import { sendWhatsAppMessage, publishToInstagram, publishToFacebook } from '../services/social-publisher';
import { eq, inArray } from 'drizzle-orm';

export const campaignsRoutes = new Elysia({ prefix: '/campaigns' })
  .post('/', async ({ body }: { body: any }) => {
    const { content, targetAccountIds, platform } = body;

    if (!content || !targetAccountIds || !platform) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }

    try {
      const newCampaign = await db.insert(campaigns).values({
        name: `Campaign ${new Date().toISOString()}`,
        content,
        platform,
        status: 'sending',
        userId: '1',
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
            await publishToInstagram(account.accessToken, account.id.toString(), { content });
          }
          if (account.platform === 'facebook') {
            await publishToFacebook(account.accessToken, account.id.toString(), { content });
          }
        }
      }

      await db.update(campaigns).set({ status: 'sent' }).where(eq(campaigns.id, newCampaign[0].id));

      return newCampaign[0];
    } catch (error) {
      console.error('Failed to create campaign:', error);
      return new Response(JSON.stringify({ error: 'Failed to create campaign' }), { status: 500 });
    }
  })
  .get('/', async () => {
    try {
      const allCampaigns = await db.select().from(campaigns);
      return allCampaigns;
    } catch (error) {
      console.error('Failed to fetch campaigns:', error);
      return new Response(JSON.stringify({ error: 'Failed to fetch campaigns' }), { status: 500 });
    }
  })
  .delete('/:id', async ({ params }) => {
    const id = parseInt(params.id);
    try {
      await db.delete(campaigns).where(eq(campaigns.id, id));
      return { message: 'Campaign deleted successfully' };
    } catch (error) {
      console.error('Failed to delete campaign:', error);
      return new Response(JSON.stringify({ error: 'Failed to delete campaign' }), { status: 500 });
    }
  });

export default campaignsRoutes;
