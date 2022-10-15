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

function injectCacheScriptOnHost() {
	const currentTab = getCurrentTab();

	console.log({
		currentTab,
	});

	chrome.scripting.executeScript({
		world: 'MAIN',
		injectImmediately: true,
		target: { tabId: currentTab.id },
		func: () => {
			const injectedScript = `
				console.log('--- injectedScript done');
				function monkeyPatch() {
					console.log('---- monkeyPatch');
					let oldXHROpen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.open = function () {

						console.log('--- XMLHttpRequest');

						this.addEventListener('load', function () {
							// const responseBody = this.responseText;
							// document.getElementById('myDataHolder').setAttribute('myData', responseBody)
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

chrome.windows.onFocusChanged.addListener(() => {
	// injectCacheScriptOnHost(tabId);
	// activeInfo.tabId;
});

chrome.tabs.onActivated.addListener((activeInfo) => {});

// (async function () {
// 	const currentTab = await chrome.tabs.query({
// 		currentWindow: true,
// 		active: true,
// 	});
// 	console.log({ currentTab });
// })();



// chrome.tabs.onActivated.addListener((activeInfo) => {
// 	chrome.scripting.executeScript({
// 		target: { tabId: activeInfo.tabId },
// 		world: 'MAIN',
// 		func: () => {

// 		},
// 	});

// const showLog = (msg) => {
// 	console.log(msg);
// 	console.log('');
// 	console.log('');
// };

// self.addEventListener('fetch', (e) => {
// 	showLog('--- respondWith serviceWorker');
// 	// e.respondWith(await makeHttpRequest(e));
// 	e.respondWith(fetch(e.request.url));
// });

// showLog('--- self.addEventListener');

// serviceWorker.addEventListener('fetch', (e) => {
// 	showLog('--- respondWith serviceWorker');
// 	// e.respondWith(await makeHttpRequest(e));
// 	e.respondWith({})
// });

// self.addEventListener('fetch', (e) => {
// 	showLog('--- respondWith serviceWorker');
// 	// e.respondWith(await makeHttpRequest(e));
// 	e.respondWith({});
// });
