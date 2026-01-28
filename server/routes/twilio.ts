import { Router, Request, Response } from "express";
import { twilioService } from "../services/twilio.ts";

const router = Router();

router.get("/twilio/token", (req: Request, res: Response) => {
  const identity = (req.query.identity as string) || `user-${Date.now()}`;
  
  const result = twilioService.generateAccessToken(identity);
  if (!result) {
    return res.status(503).json({
      error: "Twilio credentials not configured. Please add TWILIO_ACCOUNT_SID, TWILIO_API_KEY, and TWILIO_API_SECRET to your secrets.",
      configured: false
    });
  }
  
  res.json(result);
});

router.post("/twilio/voice", (req: Request, res: Response) => {
  const to = req.body.To || req.body.to;
  
  const twiml = twilioService.getVoiceResponse(to);

  res.type("text/xml").send(twiml);
});

router.post("/twilio/voice/incoming", (req: Request, res: Response) => {
  const twiml = twilioService.getIncomingCallResponse();

  res.type("text/xml").send(twiml);
});

router.get("/twilio/status", (req: Request, res: Response) => {
  res.json(twilioService.getStatus());
});

export default router;
