
import { Elysia, t } from 'elysia';
import { IStorage } from "../storage";
import { initializePlatform } from "../services/platforms";
import { db } from '../db';
import { socialAccounts } from '../db/schema';
import { eq } from 'drizzle-orm';

export const platformsRoutes = new Elysia({ prefix: '/platforms' })
  .post('/connect', async ({ body, set }) => {
    const { platform, accessToken } = body;

    if (!platform || !accessToken) {
      set.status = 400;
      return { error: "Missing platform or accessToken" };
    }

    const success = await initializePlatform(platform, {
      accessToken,
      verifyToken: process.env[`${platform.toUpperCase()}_VERIFY_TOKEN`] || "",
      isActive: true,
    });

    if (success) {
      return { success: true, message: "Platform connected successfully" };
    } else {
      set.status = 400;
      return { error: "Failed to validate platform credentials" };
    }
  }, {
    body: t.Object({
      platform: t.String(),
      accessToken: t.String(),
    })
  })
  .get('/', async () => {
    const allAccounts = await db.select().from(socialAccounts);
    return allAccounts;
  })
  .post('/webhook/meta', async ({ body, set }) => {
    const { object, entry } = body as any;

    if (object === "instagram" || object === "page") {
      entry.forEach((item: any) => {
        item.messaging.forEach((event: any) => {
          if (event.message) {
            console.log(
              "Received message from",
              event.sender.id,
              ":",
              event.message.text
            );
          }
        });
      });
    }

    set.status = 200;
    return "EVENT_RECEIVED";
  });
