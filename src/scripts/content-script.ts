import {
	EXTENSION_NAME,
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
		}
	});

	initializeBroadcastMessageCacheResponse({
		channel: `${MESSAGE_UPDATE_STATE_KEY}-${EXTENSION_STATUS_KEY}`,
		callback: function (e: MessageEvent) {
			cacheData[EXTENSION_STATUS_KEY] = e.data.value;
		},
	});
})();

const openOriginal = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	const method = arguments[0];
	const url = arguments[1];
	// @ts-ignore
	this.url = url;

	// @ts-ignore
	this.method = method;

	// @ts-ignore
	openOriginal.apply(this, [].slice.call(arguments));
};

async function onReadyStateChange(self: XMLHttpRequest, url: string) {
	let hasInCache = false;
	const responseFromCache = await getFromCache(url);
	if (responseFromCache) {
		console.table(`Endpoint ${url} found in cache...`);
		self.response.value = responseFromCache;
		// @ts-ignore
		self.readyState = XMLHttpRequest.DONE;
		hasInCache = true;
	}
	return { self, hasInCache };
}

async function onLoad(url: string, responseData: any) {
	console.table(`Endpoint ${url} added in cache...`);
	const responseBlob = new Blob([responseData]);
	const responseOptions = { status: 200 };
	putInCache(url, new Response(responseBlob, responseOptions));
}

// const URL_TARGET = 'b3h854n10k.execute-api.us-east-1.amazonaws.com';

const sendOriginal = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = async function (data) {
	// @ts-ignore
	const method = this.method;
	const methodKey = `${EXTENSION_NAME}-${method}`;
	const isMethodByPass = !cacheData[methodKey as keyof typeof cacheData];
	const isExtensionEnabled = cacheData[EXTENSION_STATUS_KEY]; 

	// @ts-ignore
	const url = this.url;
	const httpInterceptorCacheRegex = cacheData[EXTENSION_REGEX_KEY];
	const isRegexValidToApplyCache = httpInterceptorCacheRegex
		? new RegExp(httpInterceptorCacheRegex, 'g').test(url)
		: true;

	const stateChangeOriginal = this.onreadystatechange;
	this.onreadystatechange = async function () {
		let self = this;
		if (isExtensionEnabled && isRegexValidToApplyCache && !isMethodByPass) {
			const result = await onReadyStateChange(this, url);
			self = result.self;
			// @ts-ignore
			this.hasInCache = result.hasInCache;
		}
		// @ts-ignore
		await stateChangeOriginal?.apply(self, arguments);
	};

	const onLoadOriginal = this.onload;
	this.onload = async (e) => {
		isRegexValidToApplyCache &&
			!isMethodByPass &&
			// @ts-ignore
			!this.hasInCache &&
			isExtensionEnabled && (await onLoad(url, this.response));
		onLoadOriginal?.apply(this, [e]);
	};

	sendOriginal.call(this, data);
};

window.addEventListener('beforeunload', () => {
	window.XMLHttpRequest.prototype.send = sendOriginal;
});
