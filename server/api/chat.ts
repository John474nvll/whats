
import { Router } from 'express';
import { getMessages, createMessage } from '../modules/chat/chat.service';
import { sse } from '../core/sse';

const router = Router();

router.get('/:conversationId/messages', async (req, res) => {
  const messages = await getMessages(req.params.conversationId);
  res.json(messages);
});

router.post('/:conversationId/messages', async (req, res) => {
  const newMessage = await createMessage(req.params.conversationId, req.body);
  sse.send({ type: 'NEW_MESSAGE', data: newMessage });
  res.status(201).json(newMessage);
});

export default router;
