// import {
// 	updateExtensionEnable,
// 	makeHttpRequest,
// 	showLog,
// } from './http-interceptor-cache-utils.js';

async function getCurrentTab() {
	const currentTabs = await chrome.tabs.query({
		currentWindow: true,
		active: true,
	});
	const currentTab = (currentTabs || [])[0];
	return currentTab;
}

async function requestWithCacheProxy(sendResponse) {
	sendResponse({ ret: 'Valor correto' });
}

async function injectCacheScriptOnHost() {
	const currentTab = await getCurrentTab();
	chrome.scripting.executeScript({
		world: 'MAIN',
		injectImmediately: true,
		target: { tabId: currentTab.id },
		func: () => {
			const injectedScript = `
				function makeProxy() {
					const oldXHROpen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.open = makeRequest;
				};
				makeProxy();
			`;

			const script = document.createElement('script');
			script.textContent = injectedScript;
			(document.head || document.documentElement).appendChild(script);
			script.remove();
		},
	});
}

chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
	console.log({
		message,
	});
	switch (message.messageId) {
		case 'http-interceptor-cache-initialize':
			injectCacheScriptOnHost();
			break;
		case 'http-interceptor-cache-request':
			requestWithCacheProxy(sendResponse);
			break;
		default:
			break;
	}
});