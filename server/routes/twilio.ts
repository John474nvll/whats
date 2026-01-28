import { Router, Request, Response } from 'express';
import { twilioService, TwilioCredentialsError } from '../services/twilio.ts';

const router = Router();

router.get('/twilio/token', (req: Request, res: Response) => {
  try {
    const identity = (req.query.identity as string) || `user-${Date.now()}`;
    const result = twilioService.generateAccessToken(identity);
    res.json(result);
  } catch (error) {
    if (error instanceof TwilioCredentialsError) {
      return res.status(503).json({
        error: error.message,
        configured: false,
      });
    }
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post('/twilio/voice', (req: Request, res: Response) => {
  try {
    const to = req.body.To || req.body.to;
    const twiml = twilioService.getVoiceResponse(to);
    res.type('text/xml').send(twiml);
  } catch (error) {
    if (error instanceof TwilioCredentialsError) {
      return res.status(503).json({
        error: error.message,
      });
    }
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.post('/twilio/voice/incoming', (req: Request, res: Response) => {
  try {
    const twiml = twilioService.getIncomingCallResponse();
    res.type('text/xml').send(twiml);
  } catch (error) {
    if (error instanceof TwilioCredentialsError) {
      return res.status(503).json({
        error: error.message,
      });
    }
    console.error(error);
    res.status(500).json({ error: 'An unexpected error occurred.' });
  }
});

router.get('/twilio/status', (req: Request, res: Response) => {
  res.json(twilioService.getStatus());
});

export default router;
