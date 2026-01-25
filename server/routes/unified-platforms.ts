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
    // Aquí iría la lógica de verificación real con Twilio o Meta
    // Por ahora, simularemos que la verificación es exitosa y guardaremos en la BD

    const newAccount = await prisma.socialAccount.create({
      data: {
        platform: 'whatsapp',
        accountName: `WhatsApp - ${phoneNumber}`,
        accessToken: 'mock_token', // En un caso real, aquí iría el token de acceso
        userId: 1, // Asumimos un usuario por defecto
      },
    });

    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error al conectar la cuenta de WhatsApp:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default unifiedPlatformsRouter;
