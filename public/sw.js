/* Universal Children service worker.
 * Intentionally network-only: it does not cache registration or personal data.
 */
self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  // Pass requests through to the browser/network. Add caching only when needed.
  // Do not intercept non-GET requests such as registration submissions.
  if (event.request.method !== 'GET') return;
});
