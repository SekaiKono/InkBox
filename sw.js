const CACHE_NAME = 'v1.0.2hotfix';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/icon-512.png',
  './images/icon-192.png',
  './images/icon-maskable-512.png',
  './images/icon-maskable-192.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
