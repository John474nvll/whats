import { OpenAI } from 'openai';
import type { Express, Request, Response } from 'express';
import { chatStorage } from './storage';

let openai: OpenAI | undefined;

// Initialize OpenAI only if the API key is available
if (process.env.AI_INTEGRATIONS_OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
    baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
  });
} else {
  console.warn(
    'OpenAI API key is not configured. AI chat routes will be disabled.',
  );
}

export function registerChatRoutes(app: Express): void {
  // --- CHAT STORAGE ROUTES (available even without OpenAI) ---

  // Get all conversations
  app.get('/api/conversations', async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  });

  // Get single conversation with messages
  app.get('/api/conversations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error('Error fetching conversation:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  });

  // Create new conversation
  app.post('/api/conversations', async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(
        title || 'New Chat',
      );
      res.status(201).json(conversation);
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ error: 'Failed to create conversation' });
    }
  });

  // Delete conversation
  app.delete('/api/conversations/:id', async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting conversation:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  });

  // --- OPENAI-POWERED ROUTES ---

  // Guard middleware to check if OpenAI is available
  const ensureOpenAI = (req: Request, res: Response, next: Function) => {
    if (!openai) {
      return res.status(503).json({
        error: 'OpenAI integration is not configured on the server.',
      });
    }
    next();
  };

  // Send message and get AI response (streaming)
  app.post(
    '/api/conversations/:id/messages',
    ensureOpenAI,
    async (req: Request, res: Response) => {
      // This block will only execute if 'openai' is defined
      try {
        const conversationId = parseInt(req.params.id);
        const { content } = req.body;

        // Save user message
        await chatStorage.createMessage(conversationId, 'user', content);

        // Get conversation history for context
        const messages =
          await chatStorage.getMessagesByConversation(conversationId);
        const chatMessages = messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        }));

        // Set up SSE
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        // Stream response from OpenAI
        const stream = await openai!.chat.completions.create({
          model: 'gpt-4-turbo',
          messages: chatMessages,
          stream: true,
        });

        let fullResponse = '';

        for await (const chunk of stream) {
          const content = chunk.choices[0]?.delta?.content || '';
          if (content) {
            fullResponse += content;
            res.write(`data: ${JSON.stringify({ content })}\n\n`);
          }
        }

        // Save assistant message
        await chatStorage.createMessage(
          conversationId,
          'assistant',
          fullResponse,
        );

        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (error) {
        console.error('Error sending message:', error);
        if (res.headersSent) {
          res.write(
            `data: ${JSON.stringify({ error: 'Failed to send message' })}\n\n`,
          );
          res.end();
        } else {
          res.status(500).json({ error: 'Failed to send message' });
        }
      }
    },
  );
}
