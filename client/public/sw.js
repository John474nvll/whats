
// Service Worker for Softgan SocialHub PWA
import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { registerRoute, NavigationRoute } from 'workbox-routing';
import { NetworkOnly, NetworkFirst, StaleWhileRevalidate, CacheFirst } from 'workbox-strategies';
import { ExpirationPlugin } from 'workbox-expiration';
import { BackgroundSyncPlugin } from 'workbox-background-sync';
import { warmStrategyCache } from 'workbox-recipes';
import { offlineFallback } from 'workbox-recipes';

cleanupOutdatedCaches();

// VitePWA will inject the manifest here
precacheAndRoute(self.__WB_MANIFEST || []);

// Basic offline fallback
offlineFallback({
  pageFallback: '/offline.html',
});

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
        maxAgeSeconds: 365 * 24 * 60 * 60, // 1 year
      }),
    ],
  }),
);

// API calls with a Network First strategy and Background Sync
const bgSyncPlugin = new BackgroundSyncPlugin('api-sync-queue', {
  maxRetentionTime: 24 * 60, // Retry for up to 24 hours
});

registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new NetworkFirst({
    cacheName: 'api-cache',
    plugins: [
      bgSyncPlugin,
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 5 * 60, // 5 minutes
      }),
    ],
  }),
);

// More aggressive caching for CRM data
const crmDataStrategy = new StaleWhileRevalidate({
  cacheName: 'crm-data-cache',
  plugins: [
    new ExpirationPlugin({
      maxEntries: 100,
      maxAgeSeconds: 7 * 24 * 60 * 60, // 1 week
    }),
  ],
});

registerRoute(
  ({ url }) => url.pathname.match(/^\/api\/(contacts|customers|sales|appointments)/),
  crmDataStrategy
);

// Warm the CRM cache on install
const crmCacheUrls = [
  '/api/contacts',
  '/api/customers',
  '/api/sales',
  '/api/appointments'
];

self.addEventListener('install', (event) => {
  const done = warmStrategyCache({
    urls: crmCacheUrls,
    strategy: crmDataStrategy,
  });
  event.waitUntil(done);
});


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
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('push', (event) => {
  const data = event.data?.json() || {
    title: 'Softgan SocialHub',
    body: 'You have a new update from Softgan',
    icon: '/icons/icon-192x192.png',
  };

  const options = {
    body: data.body,
    icon: data.icon || '/icons/icon-192x192.png',
    badge: '/icons/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: { url: data.url || '/' },
    actions: [
      { action: 'open', title: 'View Now' },
      { action: 'close', title: 'Close' },
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
