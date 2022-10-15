const CACHE_NAME = 'http_interceptor';

const putInCache = async (request, response) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.put(request, response);
};

const cacheFirst = async (request) => {
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}
	const responseFromNetwork = await window.fetchOriginal(request);
	await putInCache(request, responseFromNetwork.clone());
	return responseFromNetwork;
};

// (async () => {
// 	await  fetch('https://httpbin.org/get')
//     .then(data => {console.log(data)})
// })();

window.fetchOriginal = window.fetchOriginal || window.fetch;
const initializeHttpCache = () => {
	console.log('>>>>>>> AQUIIIII')
	window.fetch = (e) => {
		console.log('fetch add event listener');
		e.respondWith(cacheFirst(e.request));
	};
	// window.addEventListener('fetch', (e) => {
	// 	console.log('fetch add event listener');
	// 	e.respondWith(cacheFirst(e.request));
	// });
	window.httpInterceptorCacheScriptInitialized = true;
}

initializeHttpCache();



// function fetchLive(callback) {
// 	doSomething(function (data) {
// 		chrome.storage.local.set(
// 			{ cache: data, cacheTime: Date.now() },
// 			function () {
// 				callback(data);
// 			}
// 		);
// 	});
// }

// function fetch(callback) {

// 	console.log('XPTO')

// 	chrome.storage.local.get(['cache', 'cacheTime'], function (items) {
// 		if (items.cache && items.cacheTime && items.cacheTime) {
// 			if (items.cacheTime > Date.now() - 3600 * 1000) {
// 				return callback(items.cache); // Serialization is auto, so nested objects are no problem
// 			}
// 		}

// 		fetchLive(callback);
// 	});
// }