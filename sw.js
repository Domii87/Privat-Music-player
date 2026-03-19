const CACHE_NAME = 'audio-hub-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdn.tailwindcss.com',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
];

// Install Event - Speichert wichtige Dateien im Cache
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Dateien werden gecached');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
  self.skipWaiting();
});

// Activate Event - Löscht alte Caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Alter Cache wird gelöscht', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch Event - Lädt aus dem Cache, wenn offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Rückgabe aus Cache gefunden, ansonsten Netzwerk-Request
        return response || fetch(event.request);
      })
  );
});
