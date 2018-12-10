'use strict';

// Global Variables: 
var staticCacheName = 'currency-converter-v2';

// Caching the app pages when the secrvice worker gets installed:

self.addEventListener('install', function (event) {
	var cachedUrls = ['/currencyconveter/', '/currencyconveter/src/scripts/script.js', '/currencyconveter/src/scripts/controller.js', '/currencyconveter/dist/css/main.css', '/currencyconveter/favicon.ico', 'https://fonts.googleapis.com/css?family=Montserrat:300,400,500,600,700,900', 'https://free.currencyconverterapi.com/api/v5/currencies'];

	event.waitUntil(caches.open(staticCacheName).then(function (cache) {
		return cache.addAll(cachedUrls);
	}));
});

// Giving the user the cached version of the app first:

self.addEventListener('fetch', function (event) {

	event.respondWith(caches.match(event.request).then(function (response) {
		if (response) return response;
		return fetch(event.request);
	}));
});

// Updating the cache and deleting the old one when the new service worker is activated:

self.addEventListener('activate', function (event) {
	event.waitUntil(caches.keys().then(function (cacheNames) {
		cacheNames.filter(function (cacheName) {
			return cacheName.includes('currency-converter-') && cacheName != staticCacheName;
		}).map(function (cacheName) {
			return caches.delete(cacheName);
		});
	}));
});

self.addEventListener('message', function (event) {
	if (event.data.action == 'skipWaiting') {
		self.skipWaiting();
	}
});