if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('./sw.js', { scope: './' })
	.then((registration) => console.log('Service Worker registered successfully!'))
	.catch((err) => console.log('Service Worker Failed to Register!', err))
}