import { Router, Request, Response } from "express";
import {
  getRetellStatus,
  listAgents,
  listCalls,
  getCall,
  createWebCall,
  createPhoneCall,
  getAvailableAgents,
  initRetell
} from "../services/retell";

const router = Router();

initRetell();

router.get("/retell/status", (req: Request, res: Response) => {
  res.json(getRetellStatus());
});

router.get("/retell/agents", async (req: Request, res: Response) => {
  try {
    const agents = await listAgents();
    res.json(agents);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/retell/agents/templates", (req: Request, res: Response) => {
  const templates = getAvailableAgents();
  res.json(templates);
});

router.get("/retell/calls", async (req: Request, res: Response) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const calls = await listCalls(limit);
    res.json(calls);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.get("/retell/calls/:callId", async (req: Request, res: Response) => {
  try {
    const call = await getCall(req.params.callId);
    res.json(call);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/retell/calls/web", async (req: Request, res: Response) => {
  try {
    const { agentId } = req.body;

    if (!agentId) {
      return res.status(400).json({ error: "Missing agentId" });
    }

    const call = await createWebCall(agentId);
    res.json(call);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/retell/calls/phone", async (req: Request, res: Response) => {
  try {
    const { agentId, toNumber, fromNumber } = req.body;

    if (!agentId || !toNumber) {
      return res.status(400).json({ error: "Missing agentId or toNumber" });
    }

    const call = await createPhoneCall(agentId, toNumber, fromNumber);
    res.json(call);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/retell/webhook", async (req: Request, res: Response) => {
  try {
    const event = req.body;
    console.log("Retell webhook event:", event.event_type);

    switch (event.event_type) {
      case "call_started":
        console.log(`Call started: ${event.call_id}`);
        break;
      case "call_ended":
        console.log(`Call ended: ${event.call_id}, duration: ${event.duration_ms}ms`);
        break;
      case "call_analyzed":
        console.log(`Call analyzed: ${event.call_id}`);
        break;
    }

    res.status(200).json({ received: true });
  } catch (error: any) {
    console.error("Retell webhook error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
