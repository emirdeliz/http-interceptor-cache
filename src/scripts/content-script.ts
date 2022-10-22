import { getFromCache, putInCache } from "./utils";

const openOriginal = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	const url = arguments[1];
	// @ts-ignore
	this.url = url;

	// @ts-ignore
	openOriginal.apply(this, [].slice.call(arguments));
}

async function onReadyStateChange(
	self: XMLHttpRequest,
	url: string,
) {
	const responseFromCache = await getFromCache(url);
	if (responseFromCache) {
		console.table(`Endpoint ${url} found in cache...`);
		self.response.value = responseFromCache;
		// @ts-ignore
		self.readyState = XMLHttpRequest.DONE;
	}
	return self;
}

async function onLoad(
	url: string, 
	responseData: any
) {
	console.table(`Endpoint ${url} added in cache...`);
	const responseBlob = new Blob([responseData]);
	const responseOptions = { status: 200 };
	putInCache(new URL(url), new Response(responseBlob, responseOptions));
}

const URL_TARGET = 'b3h854n10k.execute-api.us-east-1.amazonaws.com';

const sendOriginal = window.XMLHttpRequest.prototype.send;
window.XMLHttpRequest.prototype.send = function (data) {
	// @ts-ignore
	const url = this.url;
	const isRequestFromCC = url.includes(URL_TARGET);

	const stateChangeOriginal = this.onreadystatechange;
	this.onreadystatechange = async function() {
		const self = isRequestFromCC ? onReadyStateChange(this, url) : this;
		// @ts-ignore
		await stateChangeOriginal?.apply(self, arguments);
	};

	const onLoadOriginal = this.onload;
	this.onload = async (e) => {
		isRequestFromCC && await onLoad(url, this.response);
		onLoadOriginal?.apply(this, [e]);
	};

	sendOriginal.call(this, data);
};

window.addEventListener('beforeunload', () => {
	window.XMLHttpRequest.prototype.send = sendOriginal;
});