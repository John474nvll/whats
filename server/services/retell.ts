
import Retell from "retell-sdk";

// TODO: Add your Retell API key to the .env file
const retell = new Retell({ apiKey: process.env.RETELL_API_KEY || "" });

export const createAgent = async (name: string, llmWebsocketUrl: string, voiceId: string, agentPrompt: string) => {
  try {
    const newAgent = await retell.agent.create({
      llm_websocket_url: llmWebsocketUrl,
      voice_id: voiceId,
      agent_name: name,
      agent_prompt: agentPrompt,
      enable_backchannel: true,
      prompt_template: agentPrompt,
      voice_temperature: 1,
      voice_speed: 1,
      responsiveness: 1,
      reminder_max_delay_seconds: 900,
      reminder_trigger_seconds: 300,
      interruption_sensitivity: 1,
    });
    return newAgent;
  } catch (error) {
    console.error("Error creating Retell agent:", error);
    throw error;
  }
};

export const getAgent = async (id: string) => {
  try {
    const agent = await retell.agent.get(id);
    return agent;
  } catch (error) {
    console.error(`Error getting Retell agent with ID ${id}:`, error);
    throw error;
  }
};

export const listAgents = async () => {
  try {
    const agents = await retell.agent.list();
    return agents;
  } catch (error) {
    console.error("Error listing Retell agents:", error);
    throw error;
  }
};

export const updateAgent = async (id: string, name: string, llmWebsocketUrl: string, voiceId: string, agentPrompt: string) => {
  try {
    const updatedAgent = await retell.agent.update(id, {
      agent_name: name,
      llm_websocket_url: llmWebsocketUrl,
      voice_id: voiceId,
      agent_prompt: agentPrompt,
    });
    return updatedAgent;
  } catch (error) {
    console.error(`Error updating Retell agent with ID ${id}:`, error);
    throw error;
  }
};

export const deleteAgent = async (id: string) => {
  try {
    await retell.agent.delete(id);
  } catch (error) {
    console.error(`Error deleting Retell agent with ID ${id}:`, error);
    throw error;
  }
};
