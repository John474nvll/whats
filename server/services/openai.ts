import OpenAI from "openai";

const G4F_BASE_URL = process.env.G4F_BASE_URL || "http://127.0.0.1:5002/v1";
const USE_G4F = process.env.USE_G4F === "true" || !process.env.AI_INTEGRATIONS_OPENAI_API_KEY;

const openai = new OpenAI({
  apiKey: USE_G4F ? "g4f-key" : (process.env.AI_INTEGRATIONS_OPENAI_API_KEY || process.env.OPENAI_API_KEY || "dummy"),
  baseURL: USE_G4F ? G4F_BASE_URL : process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export function getAIProviderStatus() {
  return {
    provider: USE_G4F ? "g4f" : "openai",
    baseUrl: USE_G4F ? G4F_BASE_URL : (process.env.AI_INTEGRATIONS_OPENAI_BASE_URL || "https://api.openai.com/v1"),
    configured: USE_G4F || !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY
  };
}

export async function generateContent(prompt: string, maxTokens: number = 1024): Promise<string> {
  try {
    const message = await openai.chat.completions.create({
      model: "gpt-4o",
      max_completion_tokens: maxTokens,
      messages: [
        {
          role: "system",
          content: "Eres un experto en marketing digital y redes sociales. Genera contenido profesional, atractivo y optimizado para engagement."
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = message.choices[0]?.message?.content;
    return typeof content === "string" ? content : "";
  } catch (error) {
    console.error("OpenAI error:", error);
    throw error;
  }
}

export async function generateCaption(topic: string, platform: "instagram" | "facebook" | "whatsapp"): Promise<string> {
  const platformGuidelines = {
    instagram: "Usa hashtags relevantes, emojis estrategicos, y un call-to-action. Maximo 2200 caracteres pero ideal 150-200.",
    facebook: "Contenido mas largo esta permitido. Incluye preguntas para engagement. Usa emojis con moderacion.",
    whatsapp: "Mantén el mensaje corto y personal. Evita parecer spam. Incluye un CTA claro."
  };

  const prompt = `Genera un caption profesional y atractivo para ${platform} sobre: "${topic}".
  
Guias de la plataforma: ${platformGuidelines[platform]}

Formato de respuesta:
- Caption principal
- Hashtags (si aplica)
- Call to action`;

  return generateContent(prompt);
}

export async function generateResponse(message: string, context?: string): Promise<string> {
  const prompt = `Genera una respuesta profesional y amigable para este mensaje de cliente:

Mensaje: "${message}"
${context ? `Contexto adicional: ${context}` : ""}

La respuesta debe ser:
- Profesional pero cercana
- Resolver dudas o agradecer
- Incluir un siguiente paso cuando sea apropiado
- Maxímo 150 palabras`;

  return generateContent(prompt, 512);
}

export async function analyzeMessage(message: string): Promise<{
  sentiment: "positive" | "negative" | "neutral";
  confidence: number;
  summary: string;
  suggestedAction: string;
}> {
  const prompt = `Analiza el siguiente mensaje de cliente y responde en formato JSON:

Mensaje: "${message}"

Responde con este formato exacto:
{
  "sentiment": "positive" | "negative" | "neutral",
  "confidence": 0.0-1.0,
  "summary": "resumen breve del mensaje",
  "suggestedAction": "accion sugerida para el equipo"
}`;

  try {
    const response = await generateContent(prompt, 256);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Error parsing sentiment:", e);
  }

  return {
    sentiment: "neutral",
    confidence: 0.5,
    summary: message.slice(0, 100),
    suggestedAction: "Revisar manualmente"
  };
}

export async function generateCampaignContent(params: {
  type: "email" | "social" | "whatsapp" | "sms";
  product?: string;
  audience?: string;
  tone?: string;
  goal?: string;
}): Promise<{
  subject?: string;
  content: string;
  hashtags?: string[];
  cta: string;
}> {
  const prompt = `Genera contenido de campana de marketing:

Tipo: ${params.type}
Producto/Servicio: ${params.product || "General"}
Audiencia: ${params.audience || "General"}
Tono: ${params.tone || "Profesional"}
Objetivo: ${params.goal || "Engagement"}

Responde en formato JSON:
{
  "subject": "asunto del email (solo si es email)",
  "content": "contenido principal de la campana",
  "hashtags": ["hashtag1", "hashtag2"] (solo si es social),
  "cta": "call to action claro"
}`;

  try {
    const response = await generateContent(prompt, 1024);
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
  } catch (e) {
    console.error("Error generating campaign:", e);
  }

  return {
    content: "Error generando contenido",
    cta: "Contactanos"
  };
}

export async function generateSmartContent(params: {
  type: "post" | "caption" | "message" | "story" | "ad";
  topic: string;
  platform?: string;
  includeEmojis?: boolean;
  language?: string;
}): Promise<string> {
  const typeGuides = {
    post: "Contenido largo y detallado para publicacion",
    caption: "Descripcion corta y atractiva",
    message: "Mensaje directo personalizado",
    story: "Contenido efimero y casual",
    ad: "Texto publicitario con CTA fuerte"
  };

  const prompt = `Genera ${typeGuides[params.type]} sobre: "${params.topic}"

Plataforma: ${params.platform || "multi-plataforma"}
Idioma: ${params.language || "Espanol"}
${params.includeEmojis ? "Incluye emojis relevantes." : "Sin emojis."}

El contenido debe ser:
- Original y creativo
- Optimizado para engagement
- Adaptado a la plataforma
- Con call-to-action si aplica`;

  return generateContent(prompt);
}

export async function generateImage(prompt: string): Promise<string> {
  try {
    const image = await openai.images.generate({
      model: "gpt-image-1",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
    });

    return image.data?.[0]?.url || image.data?.[0]?.b64_json || "";
  } catch (error) {
    console.error("Image generation error:", error);
    throw error;
  }
}

export async function suggestHashtags(topic: string, platform: string): Promise<string[]> {
  const prompt = `Genera 10-15 hashtags relevantes para "${topic}" en ${platform}.
  
Responde solo con los hashtags separados por espacios, sin explicacion adicional.
Incluye una mezcla de hashtags populares y especificos del nicho.`;

  const response = await generateContent(prompt, 256);
  return response.split(/\s+/).filter(h => h.startsWith('#'));
}
