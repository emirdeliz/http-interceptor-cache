const CACHE_NAME = 'http_interceptor';
window.fetchOriginal = window.fetchOriginal || window.fetch;

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

self.addEventListener('fetch', function (event) {
  console.log('Fetch req', event)
});

self.onfetch = function (event) {
	console.log('AAAAAAAAAA')
	var req = event.request;
	return event.respondWith(function cacheFirst() {
		// Open your cache.
		return self.caches.open('v1').then(function (cache) {
			// Check if the request is in there.
			return cache.match(req).then(function (res) {
				// If not match, there is no rejection but an undefined response.
				if (!res) {
					// Go to network.
					return fetch(req.clone()).then(function (res) {
						// Put in cache and return the network response.
						return cache.put(req, res.clone()).then(function () {
							return res;
						});
					});
				}
				return res;
			});
		});
	});
};

// addEventListener('fetch', (event) => {
// 	console.log('TRIGGER')
// 	// Prevent the default, and handle the request ourselves.
// 	event.respondWith(
// 		(async () => {
// 			console.log('RESPOND WITH')
// 			// Try to get the response from a cache.
// 			const cachedResponse = await caches.match(event.request);
// 			// Return it if we found one.
// 			if (cachedResponse) return cachedResponse;
// 			// If we didn't find a match in the cache, use the network.
// 			return fetch(event.request);
// 		})()
// 	);
// });	

// (async () => {
// 	await  fetch('https://httpbin.org/get')
//     .then(data => {console.log(data)})
// })();

	// window.fetch = (e) => {
	// 	console.log('fetch add event listener');
	// 	console.log(e);
	// 	// return cacheFirst(e.request);
	// 	return {};
	// };
	// window.addEventListener('fetch', (e) => {
	// 	console.log('fetch add event listener');
	// 	e.respondWith(cacheFirst(e.request));
	// });



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