// const originXHROpen = window.XMLHttpRequest.prototype.open;
// window.XMLHttpRequest.prototype.open = function () {
// 	this.addEventListener('load', function () {
// 		return new Promise(function (resolve) {
			
// 		});
// 	});
// 	return originXHROpen.apply(this, arguments);
// }

const registerServiceWorker = async () => {
	if ('serviceWorker' in navigator) {
		try {
			// const swUrl = chrome.runtime.getURL(
			// 	'src/js/http-interceptor-cache-service-worker.js'
			// );
			const registration = await navigator.serviceWorker.register(
				'/src/js/http-interceptor-cache-service-worker.js',
				{
					scope: '/',
				}
			);
			if (registration.installing) {
				console.log('Service worker installing');
			} else if (registration.waiting) {
				console.log('Service worker installed');
			} else if (registration.active) {
				console.log('Service worker active');
			}
		} catch (error) {
			console.error(`Registration failed with ${error}`);
		}
	}
};
registerServiceWorker();