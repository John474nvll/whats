
import { PrismaClient } from '@prisma/client';
import { OpenAI } from 'openai';
import { sendWhatsAppMessage } from './whatsapp';

const prisma = new PrismaClient();
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

class AiOrchestrator {
  async handleIncomingMessage(phoneNumber: string, messageContent: string) {
    const user = await this.findOrCreateUser(phoneNumber);
    const conversation = await this.findOrCreateConversation(user.id);

    // Guardar el mensaje del usuario
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: 'user',
        content: messageContent,
      },
    });

    // Comprobar si el bot debe ser pausado
    if (messageContent.toUpperCase().includes('AGENTE')) {
      await this.pauseBot(conversation.id);
      // Opcional: Notificar al usuario que un agente se pondrá en contacto
      await sendWhatsAppMessage(phoneNumber, 'Un agente se pondrá en contacto contigo en breve.');
      return;
    }

    const botState = await this.getBotState(conversation.id);
    if (!botState.isActive) {
      console.log('Bot is paused for this conversation.');
      return;
    }

    const conversationHistory = await this.getConversationHistory(conversation.id);
    const aiResponse = await this.generateAiResponse(conversationHistory);

    // Guardar la respuesta del bot
    await prisma.message.create({
      data: {
        conversationId: conversation.id,
        sender: 'bot',
        content: aiResponse,
      },
    });

    // Enviar la respuesta de la IA por WhatsApp
    await sendWhatsAppMessage(phoneNumber, aiResponse);
  }

  private async findOrCreateUser(phoneNumber: string) {
    let user = await prisma.user.findUnique({ where: { phoneNumber } });
    if (!user) {
      user = await prisma.user.create({ data: { phoneNumber } });
    }
    return user;
  }

  private async findOrCreateConversation(userId: string) {
    let conversation = await prisma.conversation.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    if (!conversation) {
      conversation = await prisma.conversation.create({ data: { userId } });
    }
    return conversation;
  }

  private async getBotState(conversationId: string) {
    let botState = await prisma.botState.findUnique({ where: { conversationId } });
    if (!botState) {
      botState = await prisma.botState.create({ data: { conversationId } });
    }
    return botState;
  }

  private async pauseBot(conversationId: string) {
    return prisma.botState.update({
      where: { conversationId },
      data: { isActive: false, pausedAt: new Date() },
    });
  }

  private async getConversationHistory(conversationId: string) {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { createdAt: 'asc' },
    });
    return messages.map((msg) => ({ role: msg.sender === 'user' ? 'user' : 'assistant', content: msg.content }));
  }

  private async generateAiResponse(history: any[]) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: history,
      });
      return completion.choices[0].message.content ?? 'No pude procesar tu solicitud.';
    } catch (error) {
      console.error('Error generating AI response:', error);
      return 'Hubo un error al generar una respuesta.';
    }
  }
}

export const aiOrchestrator = new AiOrchestrator();
