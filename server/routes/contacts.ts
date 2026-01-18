
import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();

export const contactsRoutes = new Elysia()
  .use(authMiddleware) // Protege todas las rutas de contactos
  .get('/contacts', async () => {
    // Solo usuarios autenticados pueden llegar aquí
    return await prisma.user.findMany({
      where: { phoneNumber: { not: null } }, // Filtra para obtener solo contactos (con teléfono)
    });
  })
  .post('/contacts', async ({ body }: { body: any }) => {
    const { name, phoneNumber } = body;
    return await prisma.user.create({
      data: {
        name,
        phoneNumber,
      },
    });
  })
  .get('/contacts/:id', async ({ params }) => {
    const { id } = params;
    return await prisma.user.findUnique({ where: { id } });
  })
  .put('/contacts/:id', async ({ params, body }: { params: any, body: any }) => {
    const { id } = params;
    return await prisma.user.update({
      where: { id },
      data: body,
    });
  })
  .delete('/contacts/:id', async ({ params }) => {
    const { id } = params;
    await prisma.user.delete({ where: { id } });
    return { message: 'Contact deleted successfully' };
  });
