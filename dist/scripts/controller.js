'use strict';

// Functions:

var updateReady = function updateReady(worker) {
	var reply = window.confirm('Update Ready! Confirm it?');
	if (reply) {
		worker.postMessage({ action: 'skipWaiting' });
	}
};

var trackInstalling = function trackInstalling(worker) {
	worker.addEventListener('statechange', function () {
		if (worker.state == 'installed') {
			updateReady();
		}
	});
};

// Registering the service worker:

if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function (reg) {
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

		reg.addEventListener('updatefound', function () {
			trackInstalling(reg.installing);
		});
	}).catch(function (err) {
		return console.log('SW Registration Failed!', err);
	});

	navigator.serviceWorker.addEventListener('controllerchange', function () {
		window.location.reload();
	});
}