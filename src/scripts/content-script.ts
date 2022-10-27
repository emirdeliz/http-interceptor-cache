import {
	EXTENSION_REGEX_KEY,
	EXTENSION_STATUS_KEY,
	MESSAGE_GET_STATE_KEY,
	MESSAGE_UPDATE_STATE_KEY,
} from './constants';
import { ExtensionCache } from './types';
import {
	getFromCache,
	putInCache,
	initializeBroadcastMessageCacheResponse,
	sendBroadcastMessageCacheAndWaitResponse,
} from './utils';

let cacheData = {} as ExtensionCache;
(function () {
	sendBroadcastMessageCacheAndWaitResponse({
		channel: MESSAGE_GET_STATE_KEY,
		callback: function (e: MessageEvent) {
			cacheData = e.data;
		},
	});

	initializeBroadcastMessageCacheResponse({
		channel: `${MESSAGE_UPDATE_STATE_KEY}-${EXTENSION_STATUS_KEY}`,
		callback: function (e: MessageEvent) {
			cacheData[EXTENSION_STATUS_KEY] = e.data.value;
		},
	});
})();

async function processRequest(url: string, self: XMLHttpRequest) {
	const responseFromCache = await getFromCache(url);
	if (responseFromCache) {
		console.log(`Endpoint ${url} found in cache...`);
		Object.defineProperty(self, 'response', {
			value: responseFromCache,
			writable: false,
		});
		// @ts-ignore
		self.readyState = XMLHttpRequest.DONE;
		// @ts-ignore
		self.status = 200;
		// @ts-ignore
		self.onload && self.onload({} as any);
		// @ts-ignore
		self.onreadystatechange && self.onreadystatechange();
	}
	console.log({
		url,
		responseFromCache,
	});
	return !!responseFromCache;
}

async function persistCache(url: string, response: any) {
	console.log(`Endpoint ${url} added in cache...`);
	const responseBlob = new Blob([response]);
	const responseOptions = { status: 200 };

	console.log({
		response,
		url
	});

	await putInCache(url, new Response(responseBlob, responseOptions));
}

const openOriginal = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	const method = arguments[0] || 'GET';
	const url = arguments[1];
	// @ts-ignore
	this.url = url;

	// @ts-ignore
	this.method = method.toUpperCase();

	// @ts-ignore
	openOriginal.apply(this, [].slice.call(arguments));
};

const sendOriginal = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = async function (data) {
	// @ts-ignore
	const url = this.url;
	// @ts-ignore
	const method = this.method;
	const isExtensionEnabled = cacheData[EXTENSION_STATUS_KEY];
	const isMethodByPass = !cacheData[method as keyof typeof cacheData];
	const httpInterceptorCacheRegex = cacheData[EXTENSION_REGEX_KEY];
	const isRegexValidToApplyCache = httpInterceptorCacheRegex
		? new RegExp(httpInterceptorCacheRegex, 'g').test(url)
		: true;

	const isUseCache =
		isExtensionEnabled && isRegexValidToApplyCache && !isMethodByPass;

	if (isUseCache) {
		const hasInCache = await processRequest(url, this);
		console.log({ hasInCache });

		if (hasInCache) {
			this.abort();
			return;
		}
	}

	const onLoadOriginal = this.onload;
	this.onload = async function (this: XMLHttpRequest, e: ProgressEvent) {
		// @ts-ignore
		isUseCache && await persistCache(this.url, this.response);
		// @ts-ignore
		return onLoadOriginal && onLoadOriginal(this, e);
	};
	sendOriginal.call(this, data);
};
