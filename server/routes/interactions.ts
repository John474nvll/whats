import { Elysia } from 'elysia';
import { db } from '../db';
import { interactions } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const interactionsRoutes = new Elysia({ prefix: '/interactions' })
  .get('/', async () => {
    const result = await db.select().from(interactions);
    return result;
  })
  .get('/:id', async ({ params }) => {
    const { id } = params;
    const result = await db.select().from(interactions).where(eq(interactions.id, Number(id)));
    return result[0];
  })
  .post('/', async ({ body }: { body: any }) => {
    const { type, content, userId, contactId, dealId } = body;
    const newInteraction = await db.insert(interactions).values({
      type,
      content,
      userId,
      contactId,
      dealId,
    }).returning();
    return newInteraction[0];
  })
  .put('/:id', async ({ params, body }: { params: any; body: any }) => {
    const { id } = params;
    const { type, content, userId, contactId, dealId } = body;
    const updatedInteraction = await db.update(interactions).set({
      type,
      content,
      userId,
      contactId,
      dealId,
    }).where(eq(interactions.id, Number(id))).returning();
    return updatedInteraction[0];
  })
  .delete('/:id', async ({ params }) => {
    const { id } = params;
    await db.delete(interactions).where(eq(interactions.id, Number(id)));
    return { message: 'Interaction deleted' };
  });

export default interactionsRoutes;
