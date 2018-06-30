// Global Variables: 
const staticCacheName = 'currency-converter-v1';

// Caching the app pages when the secrvice worker gets installed:

self.addEventListener('install', (event) => {
	const cachedUrls = [
		'/',
		'src/scripts/script.js',
		'src/css/main.css'
	];

	event.waitUntil(
		caches.open(staticCacheName)
		.then((cache) => cache.addAll(cachedUrls))
	)
});


// Giving the user the cached version of the app first:

self.addEventListener('fetch', (event) => {

	event.respondWith(
		caches.match(event.request).then((response) => {
			if (response) return response;
			return fetch(event.request);
		})
	)
})


// Updating the cache and deleting the old one when the new service worker is activated:

self.addEventListener('activate', (event) => {
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			cacheNames.filter(cacheName => cacheName.includes('currency-converter-') && cacheName != staticCacheName).map(cacheName => caches.delete(cacheName))
		})
	);
})
