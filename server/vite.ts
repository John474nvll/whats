import { type Express } from "express";
import { createServer as createViteServer, createLogger, type ViteDevServer } from "vite";
import { type Server } from "http";
import viteConfig from "../vite.config";
import fs from "fs";
import path from "path";

const viteLogger = createLogger();

export { ViteDevServer };

export async function setupVite(server: Server, app: Express): Promise<ViteDevServer> {
  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: {
      // This is the important part. We are telling Vite to use our existing server for HMR.
      // This will prevent the EADDRINUSE error for the WebSocket server.
      hmr: { server },
      middlewareMode: true,
    },
    appType: "custom",
  });

  app.use(vite.middlewares);

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      // Apply Vite HTML transforms. This injects the Vite HMR client,
      // and also applies HTML transforms from plugins, e.g. global preambles
      // from @vitejs/plugin-react
      const html = await vite.transformIndexHtml(url, template);

      res.status(200).set({ "Content-Type": "text/html" }).end(html);
    } catch (e) {
      // If an error is caught, let Vite fix the stack trace so it maps back
      // to your actual source code.
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });

  return vite;
}
