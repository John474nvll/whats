import { Router, Request, Response } from 'express';

const router = Router();

// All Retell AI endpoints are mocked as the service has been removed.

router.get('/retell/status', (req: Request, res: Response) => {
  res.json({
    configured: false,
    message: 'Retell AI not configured - missing API key',
  });
});

router.get('/retell/agents', async (req: Request, res: Response) => {
  res.json([]);
});

router.get('/retell/agents/templates', (req: Request, res: Response) => {
  res.json([]);
});

router.get('/retell/calls', async (req: Request, res: Response) => {
  res.json([]);
});

router.get('/retell/calls/:callId', async (req: Request, res: Response) => {
  res.status(404).json({ error: 'Call not found or service not configured.' });
});

router.post('/retell/calls/web', async (req: Request, res: Response) => {
  res.status(503).json({ error: 'Retell service is not configured.' });
});

router.post('/retell/calls/phone', async (req: Request, res: Response) => {
  res.status(503).json({ error: 'Retell service is not configured.' });
});

router.post('/retell/webhook', async (req: Request, res: Response) => {
  console.log(
    'Retell webhook received, but service is not configured. Ignoring.',
  );
  res.status(200).json({ received: true });
});

export default router;
