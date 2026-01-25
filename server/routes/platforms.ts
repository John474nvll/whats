
import type { Express } from "express";
import { z } from "zod";

// Almacenamiento en memoria para simulación
let connectedAccounts: any[] = [];
let phoneConnections: any[] = [];
let verificationCodes: Record<string, string> = {};

export function registerPlatformRoutes(app: Express) {

  // GET /api/platforms/accounts - Obtener cuentas conectadas (simulado)
  app.get('/api/platforms/accounts', (req, res) => {
    res.json(connectedAccounts);
  });

  // POST /api/platforms/connect - Conectar una cuenta (simulado)
  app.post('/api/platforms/connect', (req, res) => {
    const { platform, accessToken } = req.body;
    if (!['instagram', 'facebook'].includes(platform) || !accessToken) {
      return res.status(400).json({ message: 'Plataforma o token inválido' });
    }

    // Simular una nueva conexión de cuenta
    const newAccount = {
      id: `${platform}-${Date.now()}`,
      platform,
      accountName: `${platform.charAt(0).toUpperCase() + platform.slice(1)} User`,
      accessToken,
    };
    connectedAccounts.push(newAccount);
    res.status(201).json(newAccount);
  });

  // POST /api/platforms/send-phone-code - Enviar código de verificación (simulado)
  app.post('/api/platforms/send-phone-code', (req, res) => {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: 'Número de teléfono requerido' });
    }

    // Generar y almacenar un código de verificación simulado
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    verificationCodes[phoneNumber] = code;

    console.log(`Código de verificación para ${phoneNumber}: ${code}`); // Simula el envío del código
    res.json({ success: true, message: 'Código de verificación enviado' });
  });

  // POST /api/platforms/verify-phone-code - Verificar código (simulado)
  app.post('/api/platforms/verify-phone-code', (req, res) => {
    const { phoneNumber, code } = req.body;
    if (verificationCodes[phoneNumber] === code) {
      // Simular la conexión del número de teléfono
      const newConnection = { id: `whatsapp-${Date.now()}`, phoneNumber, platform: 'whatsapp' };
      phoneConnections.push(newConnection);
      delete verificationCodes[phoneNumber]; // Limpiar código usado
      res.json({ success: true, connection: newConnection });
    } else {
      res.status(400).json({ success: false, message: 'Código inválido' });
    }
  });

  // GET /api/platforms/phone-accounts - Obtener cuentas de teléfono conectadas
  app.get('/api/platforms/phone-accounts', (req, res) => {
    res.json(phoneConnections);
  });

  // POST /api/platforms/send-message - Enviar mensaje (simulado)
  app.post('/api/platforms/send-message', (req, res) => {
    const { platform, to, content } = req.body;

    console.log(`Enviando mensaje via ${platform} a ${to}: "${content}"`);
    // Simular un ID de mensaje de la API externa
    res.json({ success: true, messageId: `msg_${Date.now()}` });
  });
}
