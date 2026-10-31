const CACHE_NAME = 'v1.0.3';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './images/icon-512.png',
  './images/icon-192.png',
  './images/icon-maskable-512.png',
  './images/icon-maskable-192.png'
];

// 安裝時，快取本地檔案
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

// 攔截所有請求
self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => {
      // 如果快取裡有，直接回傳
      if (response) {
        return response;
      }
      
      // 如果快取裡沒有，就去網路抓
      return fetch(e.request).then((networkResponse) => {
        // 如果抓成功，而且是 CDN 的外部檔案（例如 cdnjs），就順手把它存進快取！
        if (networkResponse && networkResponse.status === 200 && e.request.url.includes('cdnjs')) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, responseClone);
          });
        }
        return networkResponse;
      }).catch(() => {
        // 如果真的完全沒網路，且快取也沒有，就在 console 印出警告
        console.log('離線且無快取:', e.request.url);
      });
    })
  );
});
