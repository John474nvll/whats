import { Router, Request, Response } from 'express';
import { IStorage } from '../storage';
import { MetaService, MetaAPIError } from '../services/meta';

const META_WEBHOOK_VERIFY_TOKEN =
  process.env.META_WEBHOOK_VERIFY_TOKEN || 'socialhub_verify_token';

export function createPlatformRoutes(storage: IStorage) {
  const router = Router();

  router.post('/platforms/connect', async (req: Request, res: Response) => {
    try {
      const { platform, accessToken } = req.body;

      if (!platform || !accessToken) {
        return res
          .status(400)
          .json({ error: 'Missing platform or accessToken' });
      }

      if (platform !== 'instagram' && platform !== 'facebook') {
        return res.status(400).json({
          error: `Platform '${platform}' not supported for connection via this endpoint.`,
        });
      }

      const metaService = new MetaService(accessToken);
      const success = await metaService.validateToken();

      if (success) {
        storage.updateChannel(platform, {
          accessToken,
          verifyToken: META_WEBHOOK_VERIFY_TOKEN,
          isActive: true,
          connectedAt: new Date(),
        });
        res.json({ success: true, message: 'Platform connected successfully' });
      } else {
        res
          .status(400)
          .json({ error: 'Failed to validate platform credentials' });
      }
    } catch (error: any) {
      if (error instanceof MetaAPIError) {
        console.error('Meta API Error:', error.response);
        res.status(500).json({
          error: 'Failed to connect platform due to Meta API error.',
          details: error.message,
        });
      } else {
        console.error('Unknown error during platform connection:', error);
        res.status(500).json({ error: error.message });
      }
    }
  });

  router.get('/platforms', (req: Request, res: Response) => {
    try {
      const platforms = storage.getChannels();
      res.json(platforms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get('/platforms/webhook/meta', (req: Request, res: Response) => {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === META_WEBHOOK_VERIFY_TOKEN) {
      console.log('Meta Webhook verified');
      res.status(200).send(challenge);
    } else {
      console.error(
        'Failed webhook verification. Make sure the verify token matches.',
      );
      res.sendStatus(403);
    }
  });

  router.post('/platforms/webhook/meta', (req: Request, res: Response) => {
    try {
      const { object, entry } = req.body;

      if (object === 'instagram' || object === 'page') {
        entry.forEach((item: any) => {
          const messagingEvents =
            item.messaging || (item.changes && item.changes[0].value.messages);
          if (messagingEvents) {
            messagingEvents.forEach((event: any) => {
              if (event.message) {
                console.log(
                  'Received message from',
                  event.sender.id,
                  ':',
                  event.message.text,
                );
              } else {
                console.log('Received a non-message event:', event);
              }
            });
          }
        });
      }
      res.status(200).send('EVENT_RECEIVED');
    } catch (error: any) {
      console.error('Webhook processing error:', error);
      res.status(200).send('EVENT_RECEIVED');
    }
  });

  return router;
}
