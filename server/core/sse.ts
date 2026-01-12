
import { Request, Response } from 'express';

interface Client {
  id: number;
  res: Response;
}

let clients: Client[] = [];

const sse = {
  init: (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();

    const clientId = Date.now();
    const newClient = {
      id: clientId,
      res,
    };

    clients.push(newClient);

    req.on('close', () => {
      clients = clients.filter(client => client.id !== clientId);
    });
  },

  send: (data: any) => {
    clients.forEach(client => client.res.write(`data: ${JSON.stringify(data)}\n\n`));
  },
};

export { sse };
