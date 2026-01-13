
import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { registerMiddleware } from "./middleware";
import { registerStatic } from "./static";
import { registerVite } from "./vite";
import express from "express";

const app = express();
const httpServer = createServer(app);

async function bootstrap() {
  await registerVite(app);
  
  registerMiddleware(app);
  registerStatic(app);
  await registerRoutes(httpServer, app);
  
  const port = process.env.PORT || 3000;
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

bootstrap();
