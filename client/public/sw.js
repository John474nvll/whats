// Service Worker for SocialHub PWA
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';

// VitePWA will inject the manifest here
precacheAndRoute(self.__WB_MANIFEST || []);

const CACHE_NAME = "socialhub-v9.0";
const API_CACHE_NAME = "socialhub-api-v1";

// Cache Google Fonts with a Cache First strategy
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com' || url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  })
);

// API calls with Network First strategy
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 5, // 5 minutes
      }),
    ],
  })
);

// Static assets with Stale While Revalidate
registerRoute(
  ({ request }) => request.destination === 'style' || request.destination === 'script' || request.destination === 'worker',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  })
);

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("push", (event) => {
  const options = {
    body: event.data?.text() || "Nueva notificación de SocialHub",
    icon: "/icons/icon-192x192.png",
    badge: "/icons/icon-192x192.png",
    vibrate: [100, 50, 100],
    data: { url: "/" },
    actions: [
      { action: "open", title: "Abrir" },
      { action: "close", title: "Cerrar" }
    ]
  };
  event.waitUntil(
    self.registration.showNotification("SocialHub", options)
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "open" || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data?.url || "/"));
  }
});
