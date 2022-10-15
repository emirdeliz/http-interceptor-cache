// const originXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function () {
// 	this.addEventListener('load', function () {
// 		return new Promise(function (resolve) {
			
// 		});
// 	});
// 	return originXHROpen.apply(this, arguments);
// }

// const registerServiceWorker = async () => {
// 	if ('serviceWorker' in navigator) {
// 		try {
// 			const swUrl = '/background.js';
// 			const registration = await navigator.serviceWorker.register(swUrl, {
// 				scope: '/',
// 			});
// 			if (registration.installing) {
// 				console.log('Service worker installing');
// 			} else if (registration.waiting) {
// 				console.log('Service worker installed');
// 			} else if (registration.active) {
// 				console.log('Service worker active');
// 			}
// 		} catch (error) {
// 			console.error(`Registration failed with ${error}`);
// 		}
// 	}
// };
// registerServiceWorker();

/*  */
// if (!this.document) {
// 	self.addEventListener('install', function (e) {
// 		console.log('service worker installation');
// 	});
// } else {
// 	importScripts(
// 		'https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js'
// 	);
// 	navigator.serviceWorker.register('injectDOM.js', {
//  				scope: '/',
// 	});
// }