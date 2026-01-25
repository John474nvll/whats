import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const unifiedPlatformsRouter = Router();

// Conectar una cuenta de WhatsApp
unifiedPlatformsRouter.post('/connect-whatsapp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Se requiere un número de teléfono.' });
  }

  try {
    const newAccount = await prisma.socialAccount.create({
      data: {
        platform: 'whatsapp',
        accountName: `WhatsApp - ${phoneNumber}`,
        accessToken: 'mock_token',
        userId: 1,
      },
    });

    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error al conectar la cuenta de WhatsApp:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Desconectar una cuenta
unifiedPlatformsRouter.delete('/disconnect/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await prisma.socialAccount.delete({
      where: { id: parseInt(id, 10) },
    });
    res.status(200).json({ message: 'Cuenta desvinculada con éxito' });
  } catch (error) {
    console.error('Error al desvincular la cuenta:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default unifiedPlatformsRouter;
