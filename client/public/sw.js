// Service Worker for Softgan SocialHub PWA
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import {
  NetworkFirst,
  StaleWhileRevalidate,
  CacheFirst,
} from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';

cleanupOutdatedCaches();

// VitePWA will inject the manifest here
precacheAndRoute(self.__WB_MANIFEST || []);

// Offline Navigation Fallback
const navigationRoute = new NavigationRoute(
  new NetworkFirst({
    cacheName: 'navigations',
  }),
);
registerRoute(navigationRoute);

// Cache Google Fonts with a Cache First strategy
registerRoute(
  ({ url }) =>
    url.origin === 'https://fonts.googleapis.com' ||
    url.origin === 'https://fonts.gstatic.com',
  new CacheFirst({
    cacheName: 'google-fonts-cache',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 20,
        maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
      }),
    ],
  }),
);

// API calls with Network First strategy and Background Sync
const bgSyncPlugin = new BackgroundSyncPlugin('api-sync-queue', {
  maxRetentionTime: 24 * 60, // Retry for max 24 Hours
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      bgSyncPlugin,
      new ExpirationPlugin({
        maxAgeSeconds: 60 * 5, // 5 minutes
      }),
    ],
  }),
);

// Static assets with Stale While Revalidate
registerRoute(
  ({ request }) =>
    request.destination === 'style' ||
    request.destination === 'script' ||
    request.destination === 'worker' ||
    request.destination === 'image',
  new StaleWhileRevalidate({
    cacheName: 'static-resources',
  }),
);

self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: 'Softgan SocialHub',
    body: 'Nueva actualización de Softgan',
    icon: '/icons/icon-192x192.png',
  };

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'Ver ahora' },
      { action: 'close', title: 'Cerrar' },
    ],
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  if (event.action === 'open' || !event.action) {
    event.waitUntil(clients.openWindow(event.notification.data?.url || '/'));
  }
});
