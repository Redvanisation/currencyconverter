// Registering the service worker:

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
	.then(() => console.log('SW Regitered successfully!')) 
	.catch((err) => console.log('SW Registration Failed!'), err)
}