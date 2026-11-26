const CACHE_NAME = 'nuestro-rincon-v1';
const ASSETS = [
  './',
  './index.html',
  './home.html',
  './diario.html',
  './reset-password.html',
  './styles.css',
  './scripts.js',
  './flower_script.js',
  './counter.js',
  './manifest.json',
  './icon.svg',
  './music_home.mp3',
  './music-2.mp3'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Solo cachear mismo origen
  if (url.origin !== location.origin) return;

  // Estrategia: cache-first para assets estáticos, network-first para HTML/JS
  const isStaticAsset = request.destination === 'style' ||
                        request.destination === 'script' ||
                        request.destination === 'image' ||
                        request.destination === 'audio' ||
                        request.destination === 'manifest';

  if (isStaticAsset) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
  } else {
    // HTML, API calls: network-first
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() => caches.match(request))
    );
  }
});