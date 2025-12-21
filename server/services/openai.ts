import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateContent(prompt: string): Promise<string> {
  const message = await (openai.chat.completions.create as any)({
    model: "gpt-4-turbo",
    max_tokens: 1024,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const content = message.choices[0].message.content;
  return typeof content === "string" ? content : "";
}

export async function generateCaption(topic: string, platform: "instagram" | "facebook" | "whatsapp"): Promise<string> {
  const prompt = `Generate a professional and engaging ${platform} caption for: ${topic}. Keep it concise and platform-appropriate.`;
  return generateContent(prompt);
}

export async function generateResponse(message: string): Promise<string> {
  const prompt = `Generate a friendly and professional response to this message: "${message}". Keep it brief and helpful.`;
  return generateContent(prompt);
}

export async function analyzeMessage(message: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  summary: string;
}> {
  const prompt = `Analyze the sentiment of this message and provide a brief summary. Format: SENTIMENT|CONFIDENCE|SUMMARY: "${message}"`;
  const response = await generateContent(prompt);
  const [sentiment, confidence, summary] = response.split("|");

  return {
    sentiment: sentiment.toLowerCase() as "positive" | "negative" | "neutral",
    confidence: parseFloat(confidence) || 0.5,
    summary: summary || response,
  };
}

export async function generateImage(prompt: string): Promise<string> {
  const image = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    n: 1,
    size: "1024x1024",
  });

  return image.data[0]?.url || "";
}
