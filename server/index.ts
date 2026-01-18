
import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { registerMiddleware } from "./middleware";
import { serveStatic } from "./static";
import { setupVite } from "./vite";
import express from "express";
import { googleRoutes } from "./routes/google";

const app = express();
const httpServer = createServer(app);

async function bootstrap() {
  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    await setupVite(httpServer, app);
  }
  
  registerMiddleware(app);
  await registerRoutes(httpServer, app);
  app.use('/api', googleRoutes.handle);
  
  const port = process.env.PORT || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

bootstrap();
