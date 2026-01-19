import { Elysia } from 'elysia';
import {
  generateCaption,
  generateResponse,
  analyzeMessage,
  generateImage,
} from "../services/openai";

export const aiRoutes = new Elysia()
  .post("/ai/generate-caption", async ({ body }: { body: any }) => {
    try {
      const { topic, platform } = body;

      if (!topic || !platform) {
        return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
      }

      const caption = await generateCaption(topic, platform);
      return { content: caption };
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  })
  .post("/ai/generate-response", async ({ body }: { body: any }) => {
    try {
      const { message } = body;

      if (!message) {
        return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
      }

      const response = await generateResponse(message);
      return { content: response };
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  })
  .post("/ai/analyze-sentiment", async ({ body }: { body: any }) => {
    try {
      const { message } = body;

      if (!message) {
        return new Response(JSON.stringify({ error: "Missing message" }), { status: 400 });
      }

      const analysis = await analyzeMessage(message);
      return analysis;
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  })
  .post("/ai/generate-image", async ({ body }: { body: any }) => {
    try {
      const { prompt } = body;

      if (!prompt) {
        return new Response(JSON.stringify({ error: "Missing prompt" }), { status: 400 });
      }

      const imageUrl = await generateImage(prompt);
      return { imageUrl };
    } catch (error: any) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }
  });

export default aiRoutes;
