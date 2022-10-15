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

async function injectCacheScriptOnHost() {
	const currentTab = await getCurrentTab();

	console.log({
		currentTab,
	});

	chrome.scripting.executeScript({
		world: 'MAIN',
		injectImmediately: true,
		target: { tabId: currentTab.id },
		func: () => {
			const injectedScript = `
				function monkeyPatch() {
					let oldXHROpen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.open = function () {

						console.log('--- XMLHttpRequest');

						this.addEventListener('load', function () {
							// const responseBody = this.responseText;
							// document.getElementById('myDataHolder').setAttribute('myData', responseBody)
							chrome.runtime.sendMessage('http-interceptor-cache', (response) => {
								console.log('received data', response);
								resolve(response);
							});
						});
						return oldXHROpen.apply(this, arguments);
					};
				};
				monkeyPatch();
			`;

			console.log('--- appendChild script');
			const script = document.createElement('script');
			script.textContent = injectedScript;
			(document.head || document.documentElement).appendChild(script);
			script.remove();
		},
	});
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.messageId === 'http-interceptor-cache-initialize') {
		injectCacheScriptOnHost();
	}
});