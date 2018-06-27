self.addEventListener('install', (e) => {
	console.log("[service Worker] installed");
})

self.addEventListener('activate', (e) => {
	console.log("[service Worker] activated");
})

self.addEventListener('fetch', (e) => {
	console.log("[service Worker] fetching", e.request.url);
})