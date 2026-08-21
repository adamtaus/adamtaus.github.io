const CACHE_NAME = 'inflight-assistant-v9';
const APP_SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-ifa.png',
  './sw.js',
  './icons/panini.png',
  './icons/wrap.png',
  './icons/croque.png',
  './icons/bloomer.png',
  './icons/hotdog.png',
  './icons/pasta.png',
  './icons/pork.png',
  './icons/baguette.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const request = event.request;

  if (request.method !== 'GET') return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;

      return fetch(request)
        .then(response => {
          if (!response || response.status !== 200 || response.type === 'opaque') {
            return response;
          }

          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, copy));
          return response;
        })
        .catch(() => caches.match('./index.html'));
    })
  );
});
