import { Router, Request, Response } from "express";
import { IStorage } from "../storage";
import { initializePlatform } from "../services/platforms";

export function createPlatformRoutes(storage: IStorage) {
  const router = Router();

  router.post("/platforms/connect", async (req: Request, res: Response) => {
    try {
      const { platform, accessToken } = req.body;

      if (!platform || !accessToken) {
        return res
          .status(400)
          .json({ error: "Missing platform or accessToken" });
      }

      const success = await initializePlatform(storage, platform, {
        accessToken,
        verifyToken: process.env[`${platform.toUpperCase()}_VERIFY_TOKEN`] || "",
        isActive: true,
      });

      if (success) {
        res.json({ success: true, message: "Platform connected successfully" });
      } else {
        res
          .status(400)
          .json({ error: "Failed to validate platform credentials" });
      }
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.get("/platforms", (req: Request, res: Response) => {
    try {
      const platforms = storage.getChannels();
      res.json(platforms);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  router.post("/platforms/webhook/meta", (req: Request, res: Response) => {
    try {
      const { object, entry } = req.body;

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

      res.status(200).send("EVENT_RECEIVED");
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
