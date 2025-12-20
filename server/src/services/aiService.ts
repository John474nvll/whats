import OpenAI from "openai";

// Simple in-memory storage for short-term memory (last 5 messages per sender)
// In a real production app, use Redis.
const memoryStore: Record<string, Array<{ role: "user" | "assistant"; content: string }>> = {};

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "dummy",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export class AIService {
  static async processMessage(senderId: string, message: string): Promise<string> {
    // 1. Retrieve history
    const history = memoryStore[senderId] || [];

    // 2. Add new user message
    history.push({ role: "user", content: message });

    // 3. Keep only last 5 messages (plus the system prompt if we had one, but keeping it simple)
    if (history.length > 5) {
      history.splice(0, history.length - 5);
    }

    // 4. Call OpenAI
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o", // Using a standard model name
        messages: [
          { role: "system", content: "Eres un asistente útil y profesional para atención al cliente." },
          ...history,
        ],
      });

      const reply = response.choices[0]?.message?.content || "Lo siento, no pude procesar tu mensaje.";

      // 5. Add assistant reply to history
      history.push({ role: "assistant", content: reply });
      
      // Update store
      memoryStore[senderId] = history;

      return reply;
    } catch (error) {
      console.error("OpenAI Error:", error);
      return "Hubo un error al procesar tu solicitud.";
    }
  }

  static clearMemory(senderId: string) {
    delete memoryStore[senderId];
  }
}
