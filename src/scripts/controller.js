// Functions:

	const updateReady = (worker) => {
		const reply = window.confirm('Update Ready! Confirm it?');
		if(reply) {
			worker.postMessage({action: 'skipWaiting'});
		}
	}

	const trackInstalling = (worker) => {
		worker.addEventListener('statechange', () => {
			if (worker.state == 'installed') {
				updateReady();
			}
		});
	}

// Registering the service worker:

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js')
	.then((reg) => {
		if (!navigator.serviceWorker.controller) {
			return;
		}

		if (reg.waiting) {
			updateReady(reg.waiting);
			return;
		}

		if (reg.installing) {
			trackInstalling();
			return;
		}

		reg.addEventListener('updatefound', () => {
			trackInstalling(reg.installing);
		});
	}) 
	.catch((err) => console.log('SW Registration Failed!', err))

	navigator.serviceWorker.addEventListener('controllerchange', () => {
		window.location.reload();
	});

}
