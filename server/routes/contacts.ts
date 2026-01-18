
import { Elysia, t } from 'elysia';
import { db } from '../db';
import { contacts } from '@shared/schema';
import { eq } from 'drizzle-orm';

export const contactsRoutes = new Elysia({ prefix: '/contacts' })
  // GET all contacts - for the main data table
  .get('/', async () => {
    const allContacts = await db.select().from(contacts);
    return allContacts;
  })

  // POST a new contact
  .post('/', async ({ body }) => {
    const [newContact] = await db.insert(contacts).values(body).returning();
    return newContact;
  }, {
    body: t.Object({
      name: t.String(),
      email: t.Optional(t.String()),
      phone: t.Optional(t.String()),
      status: t.Optional(t.Enum(contacts.status.enumValues)),
    }),
  })

  // GET a single contact by ID
  .get('/:id', async ({ params }) => {
    const { id } = params;
    const [contact] = await db.select().from(contacts).where(eq(contacts.id, parseInt(id, 10)));
    if (!contact) {
      throw new Error('Contact not found');
    }
    return contact;
  })

  // PUT (update) a contact by ID
  .put('/:id', async ({ params, body }) => {
    const { id } = params;
    const [updatedContact] = await db
      .update(contacts)
      .set(body)
      .where(eq(contacts.id, parseInt(id, 10)))
      .returning();
    return updatedContact;
  }, {
    body: t.Object({
        name: t.Optional(t.String()),
        email: t.Optional(t.String()),
        phone: t.Optional(t.String()),
        status: t.Optional(t.Enum(contacts.status.enumValues)),
    }),
  })

  // DELETE a contact by ID
  .delete('/:id', async ({ params }) => {
    const { id } = params;
    await db.delete(contacts).where(eq(contacts.id, parseInt(id, 10)));
    return { message: `Contact with ID ${id} deleted successfully` };
  });
