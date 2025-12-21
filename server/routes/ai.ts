import { Router, Request, Response } from "express";
import {
  generateCaption,
  generateResponse,
  analyzeMessage,
  generateImage,
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
    res.status(500).json({ error: error.message });
  }
});

router.post("/ai/generate-response", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Missing message" });
    }

    const response = await generateResponse(message);
    res.json({ content: response });
  } catch (error: any) {
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
    res.json({ imageUrl });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
