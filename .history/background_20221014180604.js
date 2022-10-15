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
	const responseFromNetwork = await fetch(request);
	putInCache(request, responseFromNetwork.clone());
	return responseFromNetwork;
};

const initializeHttpCache = () => {
	window.addEventListener('fetch',  (e) => {
		console.log('fetch add event listener');
		e.respondWith(cacheFirst(e.request));
	});
}

initializeHttpCache();