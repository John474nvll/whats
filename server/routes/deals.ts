import { Elysia, t } from 'elysia';
import { db } from '../db';
import { deals } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const dealsRoutes = new Elysia({ prefix: '/deals' })
  .get('/', async () => {
    const result = await db.select().from(deals);
    return result;
  })
  .get('/:id', async ({ params }) => {
    const { id } = params;
    const result = await db.select().from(deals).where(eq(deals.id, Number(id)));
    return result[0];
  })
  .post('/', async ({ body }: { body: any }) => {
    const { title, value, stage, companyId, contactId } = body;
    const newDeal = await db.insert(deals).values({
      title,
      value,
      stage,
      companyId,
      contactId,
    }).returning();
    return newDeal[0];
  })
  .put('/:id', async ({ params, body }: { params: any; body: any }) => {
    const { id } = params;
    const { title, value, stage, companyId, contactId } = body;
    const updatedDeal = await db.update(deals).set({
      title,
      value,
      stage,
      companyId,
      contactId,
    }).where(eq(deals.id, Number(id))).returning();
    return updatedDeal[0];
  })
  .delete('/:id', async ({ params }) => {
    const { id } = params;
    await db.delete(deals).where(eq(deals.id, Number(id)));
    return { message: 'Deal deleted' };
  });

export default dealsRoutes;
