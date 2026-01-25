
import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { BotSchema } from '@shared/models/bot';

const prisma = new PrismaClient();
const botsRouter = Router();

// GET /api/bots - List all bots
botsRouter.get('/', async (req, res) => {
  try {
    const bots = await prisma.bot.findMany();
    res.status(200).json(bots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bots", error });
  }
});

// POST /api/bots - Create a new bot
botsRouter.post('/', async (req, res) => {
  try {
    const { id, createdAt, updatedAt, ...insertData } = BotSchema.omit({ id: true, createdAt: true, updatedAt: true }).parse(req.body);
    const newBot = await prisma.bot.create({ data: insertData });
    res.status(201).json(newBot);
  } catch (error) {
    res.status(400).json({ message: "Invalid bot data", error });
  }
});

// PUT /api/bots/:id - Update a bot
botsRouter.put('/:id', async (req, res) => {
  try {
    const botId = parseInt(req.params.id, 10);
    const botData = BotSchema.partial().parse(req.body);
    const updatedBot = await prisma.bot.update({
      where: { id: botId },
      data: botData,
    });
    res.status(200).json(updatedBot);
  } catch (error) {
    res.status(400).json({ message: "Invalid update data", error });
  }
});

// DELETE /api/bots/:id - Delete a bot
botsRouter.delete('/:id', async (req, res) => {
  try {
    const botId = parseInt(req.params.id, 10);
    await prisma.bot.delete({ where: { id: botId } });
    res.status(204).send(); // No content
  } catch (error) {
    res.status(500).json({ message: "Error deleting bot", error });
  }
});

export default botsRouter;
