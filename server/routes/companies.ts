
import { Elysia } from 'elysia';
import { PrismaClient } from '@prisma/client';
import { authMiddleware } from '../middleware/auth';

const prisma = new PrismaClient();

export const companiesRoutes = new Elysia()
  .use(authMiddleware) // Protege todas las rutas de compañías
  .get('/companies', async () => {
    return await prisma.company.findMany({ include: { contacts: true } });
  })
  .post('/companies', async ({ body }: { body: any }) => {
    const { name, address, website } = body;
    return await prisma.company.create({
      data: { name, address, website },
    });
  })
  .get('/companies/:id', async ({ params }) => {
    const { id } = params;
    return await prisma.company.findUnique({ where: { id }, include: { contacts: true } });
  })
  .put('/companies/:id', async ({ params, body }: { params: any, body: any }) => {
    const { id } = params;
    return await prisma.company.update({
      where: { id },
      data: body,
    });
  })
  .delete('/companies/:id', async ({ params }) => {
    const { id } = params;
    await prisma.company.delete({ where: { id } });
    return { message: 'Company deleted successfully' };
  });
