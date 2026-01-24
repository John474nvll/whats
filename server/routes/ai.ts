import { Router, Request, Response } from "express";
import {
  generateCaption,
  generateResponse,
  analyzeMessage,
  generateImage,
  generateSmartContent,
  generateCampaignContent,
  suggestHashtags,
} from "../services/openai";

const router = Router();

router.post("/ai/generate-caption", async (req: Request, res: Response) => {
  try {
    const { topic, platform } = req.body;

    if (!topic || !platform) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const caption = await generateCaption(topic, platform);
    res.json({ content: caption });
  } catch (error: any) {
    console.error("Generate caption error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/generate-response", async (req: Request, res: Response) => {
  try {
    const { message, context } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await generateResponse(message, context);
    res.json({ content: response });
  } catch (error: any) {
    console.error("Generate response error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/analyze-sentiment", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const analysis = await analyzeMessage(message);
    res.json(analysis);
  } catch (error: any) {
    console.error("Analyze sentiment error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/generate-image", async (req: Request, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const imageUrl = await generateImage(prompt);
    res.json({ url: imageUrl, imageUrl });
  } catch (error: any) {
    console.error("Generate image error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/generate-smart-content", async (req: Request, res: Response) => {
  try {
    const { type, topic, platform, includeEmojis, language } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Missing topic" });
    }

    const content = await generateSmartContent({
      type: type || "post",
      topic,
      platform,
      includeEmojis: includeEmojis !== false,
      language: language || "es"
    });

    res.json({ generated: content, content });
  } catch (error: any) {
    console.error("Generate smart content error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/generate-campaign", async (req: Request, res: Response) => {
  try {
    const { type, product, audience, tone, goal } = req.body;

    if (!type) {
      return res.status(400).json({ error: "Missing campaign type" });
    }

    const campaign = await generateCampaignContent({
      type,
      product,
      audience,
      tone,
      goal
    });

    res.json(campaign);
  } catch (error: any) {
    console.error("Generate campaign error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/suggest-hashtags", async (req: Request, res: Response) => {
  try {
    const { topic, platform } = req.body;

    if (!topic) {
      return res.status(400).json({ error: "Missing topic" });
    }

    const hashtags = await suggestHashtags(topic, platform || "instagram");
    res.json({ hashtags });
  } catch (error: any) {
    console.error("Suggest hashtags error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
