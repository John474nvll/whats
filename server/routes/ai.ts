import { Router, Request, Response } from "express";

const router = Router();

// All AI endpoints are mocked as the service has been removed.

router.post("/ai/generate-caption", async (req: Request, res: Response) => {
  res.json({ content: "This is a mocked caption for your post." });
});

router.post("/ai/generate-response", async (req: Request, res: Response) => {
  res.json({ content: "This is a mocked response to the customer." });
});

router.post("/ai/analyze-sentiment", async (req: Request, res: Response) => {
  res.json({ sentiment: "neutral", confidence: 0.9 });
});

router.post("/ai/generate-image", async (req: Request, res: Response) => {
  res.json({ url: "https://via.placeholder.com/1024x1024.png?text=Mocked+Image" });
});

router.post("/ai/generate-smart-content", async (req: Request, res: Response) => {
  res.json({ content: "This is mocked smart content, generated for your topic." });
});

router.post("/ai/generate-campaign", async (req: Request, res: Response) => {
  res.json({
    title: "Mocked Campaign Title",
    description: "This is the description for a mocked campaign.",
    steps: [
      { title: "Step 1", content: "Initial outreach post." },
      { title: "Step 2", content: "Follow-up message." },
    ]
  });
});

router.post("/ai/suggest-hashtags", async (req: Request, res: Response) => {
  res.json({ hashtags: ["#mocked", "#ai", "#socialhub"] });
});

export default router;
