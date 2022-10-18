import { APP_NAME } from './constants';

export const getExtensionStatusByTab = (tabId?: number) => {
	const isEnabled = localStorage.getItem(`${APP_NAME}-enabled-${tabId}`) === 'true';
	return isEnabled;
};

export const setExtensionStatusByTab = (tabId?: number, isEnabled?: boolean) => {
	localStorage.setItem(`${APP_NAME}-enabled-${tabId}`, String(isEnabled));
};

export const getCurrentTab = () => {
	return new Promise<chrome.tabs.Tab>((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			resolve(tabs[0] as chrome.tabs.Tab);
		});
	});
}

export const getFromCache = async (key: string) => {
	const result = await caches.match(key);
	return result;
}

export const putInCache = async (request: RequestInfo, response: any) => {
	const cache = await caches.open(APP_NAME);
	await cache.put(request, response);
};

export const makeFetch = async (
	fetchOrigin: (
		input: RequestInfo | URL,
		init?: RequestInit
	) => Promise<Response>,
	url: string,
	options?: RequestInit
) => {
	const responseFromCache = await getFromCache(url);
	if (responseFromCache) {
		console.log('Has cache to: ', url);
		return responseFromCache;
	}

	console.log('No cache to: ', url);
	const responseFromNetwork = await fetchOrigin(url, options);
	await putInCache(url, responseFromNetwork.clone());
	return responseFromNetwork;
};

export const injectScript = ({ path, script }: { path?: string; script?: string }) => {
	return new Promise<void>((resolve) => {
		const s = document.createElement('script');
		if (path) {
			s.src = chrome.runtime.getURL(path);
		} else if (script) {
			s.innerHTML = script;
		}
		s.onload = () => {
			resolve();
			s.remove();
		};
		(document.head || document.documentElement).appendChild(s);
	});
};
