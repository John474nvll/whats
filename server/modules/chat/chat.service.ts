
import prisma from '../../core/database';

export const getMessages = async (conversationId: string) => {
  return await prisma.message.findMany({
    where: { conversationId },
  });
};

export const createMessage = async (conversationId: string, messageData: any) => {
  return await prisma.message.create({
    data: {
      ...messageData,
      conversationId,
    },
  });
};
