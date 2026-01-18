
import { Elysia } from 'elysia';
import { db } from '../db';
import { sql } from 'drizzle-orm';
import { conversations, contacts } from '@shared/schema';

export const dashboardRoutes = new Elysia({ prefix: '/dashboard' })
  .get('/stats', async () => {
    // In a real application, you would also fetch campaign data and conversion rates.
    // For now, we'll focus on what we can get from our existing schemas.

    // 1. Get new contacts in the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const newContactsCount = await db
      .select({ count: sql<number>`count(*)` })
      .from(contacts)
      .where(sql`${contacts.createdAt} >= ${thirtyDaysAgo}`);

    // 2. Get active conversations (e.g., messages in the last 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    const activeConversationsCount = await db
      .select({ count: sql<number>`count(distinct ${conversations.id})` })
      .from(conversations)
      .where(sql`${conversations.lastMessageAt} >= ${twentyFourHoursAgo}`);
      
    // Mocked data for now, as we don't have campaigns or conversion tracking yet.
    const activeCampaigns = 0; // Placeholder
    const conversionRate = '0%'; // Placeholder

    return {
      newContacts: newContactsCount[0].count,
      activeConversations: activeConversationsCount[0].count,
      activeCampaigns: activeCampaigns,
      conversionRate: conversionRate,
    };
  });
