const CACHE_NAME = 'persetujuan-pengguna-v1';

const urlsToCache = [
  '/About-bitcoin/',
  '/About-bitcoin/index.html',
  '/About-bitcoin/fakeload.html',
  '/About-bitcoin/Wallet.html',
  'Wallet.html', // ✅ tambahin path relatif buat jaga-jaga
  '/About-bitcoin/manifest.json',
  '/About-bitcoin/icon-72x72.png',
  '/About-bitcoin/icon-192x192.png',
  '/About-bitcoin/icon-512x512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Opened cache');
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  console.log('[SW] Fetching:', event.request.url);
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('[SW] Cache hit:', event.request.url);
        return response;
      }
      console.log('[SW] Cache miss, fetching:', event.request.url);
      return fetch(event.request).catch(() => {
        // Optional: fallback if fetch fails (offline mode)
        if (event.request.url.endsWith('Wallet.html')) {
          return caches.match('Wallet.html');
        }
      });
    })
  );
});

self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('[SW] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      )
    )
  );
});