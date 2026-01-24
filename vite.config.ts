import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from 'url';
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
import { VitePWA } from "vite-plugin-pwa";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRootDir = path.resolve(__dirname);

export default defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    VitePWA({
      registerType: "autoUpdate",
      injectRegister: 'auto',
      includeAssets: ["favicon.png"],
      workbox: {
        globPatterns: ["**/*.{js,css,html,png,svg,json}"],
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        navigateFallback: "index.html",
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-cache",
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/api\./i,
            handler: "NetworkFirst",
            options: { cacheName: "api-cache", expiration: { maxAgeSeconds: 60 * 5 } },
          },
        ],
      },
      manifest: {
        name: "SocialHub v3.0 - Plataforma de Gestión de Redes Sociales",
        short_name: "SocialHub",
        description: "Platform completa para gestionar Instagram, Facebook y WhatsApp desde un único dashboard profesional",
        theme_color: "#000000",
        background_color: "#000000",
        display: "standalone",
        orientation: "portrait-primary",
        start_url: "/",
        scope: "/",
        screenshots: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "maskable",
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
        categories: ["business", "productivity"],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(projectRootDir, "client", "src"),
      "@shared": path.resolve(projectRootDir, "shared"),
      "@assets": path.resolve(projectRootDir, "attached_assets"),
    },
  },
  root: path.resolve(projectRootDir, "client"),
  build: {
    outDir: path.resolve(projectRootDir, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    host: '0.0.0.0',
    port: 4000,
    proxy: {
      '/api': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
    hmr: {
        clientPort: 443
    },
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
});
