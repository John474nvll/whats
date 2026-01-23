
import type { Express } from "express";
import { createServer, type Server } from "http";
import { registerRoutes } from "./routes";
import { registerMiddleware } from "./middleware";
import { serveStatic } from "./static";
import { setupVite } from "./vite";
import express from "express";

import { setupDemoAccounts } from "./services/auth";

const app = express();
const httpServer = createServer(app);

async function bootstrap() {
  // Setup demo accounts on startup
  try {
    await setupDemoAccounts();
  } catch (err) {
    console.error("Failed to setup demo accounts:", err);
  }

  if (process.env.NODE_ENV === 'production') {
    serveStatic(app);
  } else {
    await setupVite(httpServer, app);
  }
  
  registerMiddleware(app);
  await registerRoutes(httpServer, app);
  
  const port = parseInt(process.env.PORT || "3000");
  httpServer.listen(port, '0.0.0.0', () => {
    console.log(`Server listening on http://0.0.0.0:${port}`);
  });
}

bootstrap();
