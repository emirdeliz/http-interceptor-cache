export const CACHE_NAME = 'http_interceptor'
export const CACHE_BASE_KEY = 'cache';
export const CACHE_TIME_BASE_KEY = 'cacheTime';
export const CACHE_ENABLE_KEY = 'enable';

// const originalFetch = globalThis.fetch;
function updateExtensionEnable() {
	// const isEnable = Boolean(await getCacheValue(CACHE_ENABLE_KEY));


	// showLog('isEnable -> ' + isEnable);

	// setCacheValue(CACHE_ENABLE_KEY, !isEnable);
};

// export const showLog = (msg) => {
// 	console.log(msg);
// 	console.log('');
// 	console.log('');
// }

// export const makeHttpRequest = async (e) => {
// 	showLog('--- makeHttpRequest');
// 	const isCacheEnable = await getCacheValue(e.url);
// 	showLog({ e });
// 	showLog(String(e));
// 	showLog('--- isCacheEnable ' + isCacheEnable);

// 	if (isCacheEnable) {
// 		const cachedData = await getRequestResultFromCache(e.url);
// 		const hasCacheFromUrl = !!cachedData;

// 		showLog('---hasCacheFromUrl ' + hasCacheFromUrl);
// 		showLog(cachedData);

// 		if (hasCacheFromUrl) {
// 			return cachedFiles;
// 		}
// 	}
	
// 	const response = await originalFetch(e);
// 	try {
// 		const responseClone = response.clone();
// 		return await setRequestResultFromCache(e.url, responseClone);
// 	} catch (e) {
// 		console.log(e);
// 	}
// 	return response;
// };

// // Reads all data out of storage.sync and exposes it via a promise.
// //
// // Note: Once the Storage API gains promise support, this function
// // can be greatly simplified.
// export const getRequestResultFromCache = async (url) => {
// 	// Immediately return a promise and start asynchronous work
// 	const cacheValue = await getCacheValue(url);
// 	const cacheExpireTime = Date.now() - 24 * 3600 * 1000; // Cache for one day
// 	if (
// 		cacheValue &&
// 		cacheValue[url] &&
// 		cacheValue.createdAt > cacheExpireTime
// 	) {
// 		return items.cache; // Serialization is auto, so nested objects are no problem
// 	}
// };

// export const setRequestResultFromCache = async (key, value) => {
// 	return setCacheValue(key, value);
// };

// export const getCacheValue = async (key) => {
// 	return new Promise((resolve, _reject) => {
// 		chrome.storage.local.get(key, (items) => {
// 			resolve(items[key]);
// 		});
// 	});
// 	// const cache = await getCache();
// 	// await cache.match(key);
// };

// export const setCacheValue = async (key, value) => {
// 	return new Promise((resolve, _reject) => {
// 		chrome.storage.local.set({ [key]: value, createdAt: Date.now() }, () => {
// 			resolve(value);
// 		});
// 	});
// 	// const cache = await getCache();
// 	// await cache.put(key, value);
// 	// return value;
// };