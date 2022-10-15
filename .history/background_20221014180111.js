const CACHE_NAME = 'http_interceptor';

function makeProxy() {
	const oldXHROpen = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function () {
		this.addEventListener('load', function () {
			// return new Promise(function (resolve) {
			// 	chrome.runtime.sendMessage(
			// 		{ messageId: 'http-interceptor-cache-request' },
			// 		function (response) {
			// 			resolve(response);
			// 		}
			// 	);
			// });
		});
		return oldXHROpen.apply(this, arguments);
	};
}
makeProxy();

const putInCache = async (request, response) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.put(request, response);
};

const cacheFirst = async (request) => {
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}
	const responseFromNetwork = await fetch(request);
	putInCache(request, responseFromNetwork.clone());
	return responseFromNetwork;
};
