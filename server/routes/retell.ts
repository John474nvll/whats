
import { Router } from "express";
import {
  createAgent,
  getAgent,
  listAgents,
  updateAgent,
  deleteAgent,
} from "../services/retell";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { name, llm_websocket_url, voice_id, agent_prompt } = req.body;
    const newAgent = await createAgent(name, llm_websocket_url, voice_id, agent_prompt);
    res.status(201).json(newAgent);
  } catch (error) {
    res.status(500).json({ error: "Failed to create agent" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const agent = await getAgent(req.params.id);
    res.json(agent);
  } catch (error) {
    res.status(500).json({ error: "Failed to get agent" });
  }
});

router.get("/", async (req, res) => {
  try {
    const agents = await listAgents();
    res.json(agents);
  } catch (error) {
    res.status(500).json({ error: "Failed to list agents" });
  }
});

router.patch("/:id", async (req, res) => {
  try {
    const { name, llm_websocket_url, voice_id, agent_prompt } = req.body;
    const updatedAgent = await updateAgent(
      req.params.id,
      name,
      llm_websocket_url,
      voice_id,
      agent_prompt
    );
    res.json(updatedAgent);
  } catch (error) {
    res.status(500).json({ error: "Failed to update agent" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await deleteAgent(req.params.id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete agent" });
  }
});

export default router;
