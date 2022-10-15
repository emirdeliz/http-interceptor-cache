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
	const id = chrome.runtime.id;

	chrome.scripting.executeScript({
		world: 'MAIN',
		injectImmediately: true,
		target: { tabId: currentTab.id },
		func: () => {

			
			const injectedScript = `
				function makeProxy() {
					const oldXHROpen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.open = function () {
						this.addEventListener('load', function () {
							return new Promise(function (resolve) {
								console.log('HERE Promise')
								chrome.runtime.sendMessage({type: "notification", options: { 
    type: "basic", 
    iconUrl: chrome.extension.getURL("icon128.png"),
    title: "Test",
    message: "Test"
}});
							});
						});
						return oldXHROpen.apply(this, arguments);
					};
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