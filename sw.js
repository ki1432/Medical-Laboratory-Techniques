const CACHE_PREFIX = 'mlt-department-offline-';
const CACHE_NAME = CACHE_PREFIX + 'v4-virtual-lab';
const LOCAL_ASSETS = ['./', './index.html', './student-portal.html', './student-portal', './virtual-lab.html', './virtual-lab', './virtual-lab.css', './virtual-lab.js', './app.js', './app.js?v=6.0'];
const LOCAL_URLS = new Set(LOCAL_ASSETS.map(path => new URL(path, self.registration.scope).href));

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(LOCAL_ASSETS.map(path => new Request(new URL(path, self.registration.scope), {cache: 'reload'})));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

// Refresh public application files online, with a cached fallback offline.
// Do not intercept APIs, external PDF sources, or non-GET requests.
self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || !LOCAL_URLS.has(request.url)) return;

  let resolveCacheWrite;
  const cacheWrite = new Promise(resolve => { resolveCacheWrite = resolve; });
  event.waitUntil(cacheWrite);
  event.respondWith((async () => {
    try {
      const response = await fetch(new Request(request, {cache: 'no-cache'}));
      if (response.ok && response.type === 'basic') {
        const copy = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, copy)).catch(() => {}).finally(resolveCacheWrite);
      } else {
        resolveCacheWrite();
      }
      return response;
    } catch (error) {
      resolveCacheWrite();
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request);
      if (cached) return cached;
      return new Response('Offline: this page has not been saved yet.', {
        status: 503, headers: {'Content-Type': 'text/plain; charset=utf-8'}
      });
    }
  })());
});
