const CACHE_NAME = 'anesthesia-portal-v2';
const assets = ['./index.html', './student-portal.html', './virtual-lab.html', './style.css', './virtual-lab.css', './app.js', './virtual-lab.js', './manifest.json'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(assets)));
});
self.addEventListener('fetch', e => {
  e.respondWith(caches.match(e.request).then(response => response || fetch(e.request)));
});
