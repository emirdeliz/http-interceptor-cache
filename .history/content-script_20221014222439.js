const CACHE_NAME = 'http_interceptor';
window.fetchOriginal = window.fetchOriginal || window.fetch;

const putInCache = async (request, response) => {
	const cache = await caches.open(CACHE_NAME);
	await cache.put(request, response);
};

const cacheFirst = async (fetchOrigin, request) => {
	const responseFromCache = await caches.match(request);
	if (responseFromCache) {
		return responseFromCache;
	}
	const responseFromNetwork = await fetchOrigin(request);
	await putInCache(request, responseFromNetwork.clone());
	return responseFromNetwork;
};

window.fetch = new Proxy(window.fetch, {
	apply(fetch, that, args) {
		const result = cacheFirst(fetch, args[0]);
		return result;
	},
});