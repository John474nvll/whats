import { Elysia } from 'elysia';
import {
  createAgent,
  getAgent,
  listAgents,
  updateAgent,
  deleteAgent,
} from "../services/retell";

export const retellRoutes = new Elysia({ prefix: '/retell' })
  .post("/", async ({ body }: { body: any }) => {
    try {
      const { name, llm_websocket_url, voice_id, agent_prompt } = body;
      const newAgent = await createAgent(name, llm_websocket_url, voice_id, agent_prompt);
      return newAgent;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to create agent" }), { status: 500 });
    }
  })
  .get("/:id", async ({ params }) => {
    try {
      const agent = await getAgent(params.id);
      return agent;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to get agent" }), { status: 500 });
    }
  })
  .get("/", async () => {
    try {
      const agents = await listAgents();
      return agents;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to list agents" }), { status: 500 });
    }
  })
  .patch("/:id", async ({ params, body }: { params: any; body: any }) => {
    try {
      const { name, llm_websocket_url, voice_id, agent_prompt } = body;
      const updatedAgent = await updateAgent(
        params.id,
        name,
        llm_websocket_url,
        voice_id,
        agent_prompt
      );
      return updatedAgent;
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to update agent" }), { status: 500 });
    }
  })
  .delete("/:id", async ({ params }) => {
    try {
      await deleteAgent(params.id);
      return new Response(null, { status: 204 });
    } catch (error) {
      return new Response(JSON.stringify({ error: "Failed to delete agent" }), { status: 500 });
    }
  });

export default retellRoutes;
