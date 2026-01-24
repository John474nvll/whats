import OpenAI from "openai";

// Simple orchestrator service
export class AiOrchestrator {
  private openai: OpenAI;
  
  constructor() {
    // Expects OPENAI_API_KEY to be set in env
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "dummy" });
  }

  async generateResponse(message: string, context: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
      return "AI is not configured (OPENAI_API_KEY missing).";
    }

    try {
      const response = await this.openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: `You are a helpful assistant. Context: ${context}` },
          { role: "user", content: message }
        ],
      });

      return response.choices[0].message.content || "Sorry, I couldn't generate a response.";
    } catch (error) {
      console.error("AI Error:", error);
      return "I'm having trouble thinking right now.";
    }
  }

  shouldHandoverToAgent(message: string): boolean {
    return message.toUpperCase().includes("AGENTE");
  }
}

export const aiOrchestrator = new AiOrchestrator();
