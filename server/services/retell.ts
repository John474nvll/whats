import Retell from "retell-sdk";

const RETELL_API_KEY = process.env.RETELL_API_KEY || "";

let retellClient: Retell | null = null;

export function initRetell(): Retell | null {
  if (!RETELL_API_KEY) {
    console.log("Retell AI not configured - missing API key");
    return null;
  }

  try {
    retellClient = new Retell({ apiKey: RETELL_API_KEY });
    console.log("Retell AI SDK initialized successfully");
    return retellClient;
  } catch (error) {
    console.error("Failed to initialize Retell SDK:", error);
    return null;
  }
}

export function getRetellClient(): Retell | null {
  return retellClient;
}

export function getRetellStatus() {
  return {
    configured: !!RETELL_API_KEY,
    hasApiKey: !!RETELL_API_KEY
  };
}

export interface RetellAgentConfig {
  agentName: string;
  voiceId: string;
  language: string;
  prompt: string;
  beginMessage?: string;
  model?: string;
  voiceTemperature?: number;
  voiceSpeed?: number;
}

const DEFAULT_AGENTS: Record<string, RetellAgentConfig> = {
  santi: {
    agentName: "Santi - Sales BDR",
    voiceId: "11labs-Bing",
    language: "es-ES",
    prompt: `## Identity
You are Santi, an elite Business Development Representative at SocialHub. Your goal is to convert leads into scheduled discovery meetings with high urgency. You sound like a tech consultant: knowledgeable, energetic, and highly professional.

## Style Guardrails
- Concise & Direct: Your average response should be under 20 words.
- Tone: Confident, high-energy, professional but accessible.`,
    beginMessage: "Hola! Soy Santi de SocialHub. ¿Cómo puedo ayudarte hoy?",
    model: "gpt-4.1",
    voiceTemperature: 0.58,
    voiceSpeed: 0.96
  },
  valentina: {
    agentName: "Valentina - Technical Sales",
    voiceId: "11labs-Maria",
    language: "es-ES",
    prompt: `## Identity
You are Valentina, the Senior Technical Sales Executive at SocialHub. You are an expert in CRM systems, social media management, and marketing automation. You are professional, persuasive, and highly efficient.

## Style Guardrails
- Technical but accessible
- Focus on solving business problems
- Always provide value in every interaction`,
    beginMessage: "Buenas! Soy Valentina, tu asesora técnica. ¿En qué puedo asistirte?",
    model: "gpt-4.1",
    voiceTemperature: 0.5,
    voiceSpeed: 0.9
  },
  support: {
    agentName: "Support Agent",
    voiceId: "11labs-Daniel",
    language: "es-MX",
    prompt: `## Identity
You are a helpful customer support agent for SocialHub. Your goal is to resolve customer issues efficiently and ensure satisfaction.

## Guidelines
- Be patient and empathetic
- Always confirm understanding before providing solutions
- Escalate complex issues when needed`,
    beginMessage: "Bienvenido al soporte de SocialHub. ¿Cómo puedo ayudarte?",
    model: "gpt-4o",
    voiceTemperature: 0.4,
    voiceSpeed: 1.0
  }
};

export function getAvailableAgents(): RetellAgentConfig[] {
  return Object.values(DEFAULT_AGENTS);
}

export function getAgentConfig(agentId: string): RetellAgentConfig | null {
  return DEFAULT_AGENTS[agentId] || null;
}

export async function createPhoneCall(
  agentId: string,
  toNumber: string,
  fromNumber?: string
): Promise<any> {
  if (!retellClient) {
    throw new Error("Retell SDK not initialized");
  }

  const agent = getAgentConfig(agentId);
  if (!agent) {
    throw new Error(`Agent ${agentId} not found`);
  }

  try {
    const call = await retellClient.call.createPhoneCall({
      from_number: fromNumber || process.env.RETELL_PHONE_NUMBER || "",
      to_number: toNumber,
    });
    return call;
  } catch (error: any) {
    console.error("Error creating Retell phone call:", error);
    throw error;
  }
}

export async function createWebCall(agentId: string): Promise<any> {
  if (!retellClient) {
    throw new Error("Retell SDK not initialized");
  }

  try {
    const call = await retellClient.call.createWebCall({
      agent_id: agentId,
    });
    return call;
  } catch (error: any) {
    console.error("Error creating Retell web call:", error);
    throw error;
  }
}

export async function listCalls(limit: number = 50): Promise<any[]> {
  if (!retellClient) {
    return [];
  }

  try {
    const calls = await (retellClient.call as any).list({ limit });
    return Array.isArray(calls) ? calls : [];
  } catch (error: any) {
    console.error("Error listing Retell calls:", error);
    return [];
  }
}

export async function getCall(callId: string): Promise<any> {
  if (!retellClient) {
    throw new Error("Retell SDK not initialized");
  }

  try {
    const call = await (retellClient.call as any).retrieve(callId);
    return call;
  } catch (error: any) {
    console.error("Error getting Retell call:", error);
    throw error;
  }
}

export async function listAgents(): Promise<any[]> {
  if (!retellClient) {
    return Object.entries(DEFAULT_AGENTS).map(([id, config]) => ({
      id,
      name: config.agentName,
      language: config.language,
      voiceId: config.voiceId,
      isDefault: true
    }));
  }

  try {
    const agents = await (retellClient.agent as any).list();
    return Array.isArray(agents) ? agents : [];
  } catch (error: any) {
    console.error("Error listing Retell agents:", error);
    return Object.entries(DEFAULT_AGENTS).map(([id, config]) => ({
      id,
      name: config.agentName,
      language: config.language,
      voiceId: config.voiceId,
      isDefault: true
    }));
  }
}
