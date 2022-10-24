import { APP_NAME, MESSAGE_GET_STATE_KEY, MESSAGE_UPDATE_STATE_KEY } from './constants';

let cache: Cache;
async function getCacheInstance() {
	if (!cache) {
		cache = await caches.open(APP_NAME);
	}
	return cache;
}

export function updateExtensionState(
	key: string,
	value: string | boolean,
	callback?: Function
) {
	const messageKey = MESSAGE_UPDATE_STATE_KEY;
	chrome.runtime.sendMessage({ messageKey, key, value }, function () {
		callback && callback();
	});
}

export function getExtensionState(key: string, callback?: Function) {
	const messageKey = MESSAGE_GET_STATE_KEY;
	chrome.runtime.sendMessage({ messageKey, key }, function (response) {
		console.log({ key, response });
		callback && callback(response ? response[key] : '');
	});
}

export function getCurrentTab() {
	return new Promise<chrome.tabs.Tab>((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			resolve(tabs[0] as chrome.tabs.Tab);
		});
	});
}

export async function getFromCache(key: string) {
	try {
		const cacheInstance = await getCacheInstance();
		const result = await cacheInstance.match(key);
		return result;
	} catch (e) {
		console.warn('Error - GET cache: ', e);
	}
}

export async function putInCache(request: RequestInfo | URL, response: Response) {
	const cacheInstance = await getCacheInstance();
	try {
		await cacheInstance.put(request, response);
	} catch(e) {
		console.warn('Error - SET cache: ', e);
	}
}

export async function makeFetch(self: XMLHttpRequest,
	args?: IArguments) {
	const url = args ? args[1] : '';
	const isRequestFromCC = url.includes(
		'b3h854n10k.execute-api.us-east-1.amazonaws.com'
	);

	const responseFromCache = isRequestFromCC ? await getFromCache(url) : null;
	if (responseFromCache) {
		console.table(`Endpoint ${url} found in cache...`);
		return responseFromCache;
	}

	isRequestFromCC &&
		console.table(`Endpoint ${url} is not found in the cache...`);
	// @ts-ignore
	const responseFromNetwork = await self.xhrOpenOriginal.apply(self, args);
	if (isRequestFromCC) {
		await putInCache(url, responseFromNetwork.clone());
	}
	return responseFromNetwork;
}

export function injectScript({ path, type, id }: { path?: string; type?: string; id?: string; }) {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script');
		if (id) {
			script.id = id;
		}
		if (path) {
			script.src = chrome.runtime.getURL(path);
		}

		script.type = type || "text/javascript";
		script.onload = () => {
			resolve();
			script.remove();
		};
		(document.head || document.documentElement).appendChild(script);
	});
}

export async function injectCss({ path }: { path: string; }) {
	const style = document.createElement('link');
	style.id = chrome.runtime.id;
	style.href = chrome.runtime.getURL(path);
	style.rel = 'stylesheet';
	document.documentElement.appendChild(style);
}
