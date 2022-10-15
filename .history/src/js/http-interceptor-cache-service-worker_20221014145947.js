addEventListener('fetch', (e) => {
	console.log('WORKEEEEEE');
	e.respondWith(
		fetch(/*btw xhr is undefined*/ e.request)
	);
});

// const resourceUrl = chrome.runtime.getURL(
// 	'src/js/http-interceptor-cache-service-worker.js'
// );

// const actualCode = `
// 	var s = document.createElement('script');
// 	s.src = ${resourceUrl};
// 	s.onload = function() {
// 	this.remove();
// 	};
// 	(document.head || document.documentElement).appendChild(s);
// `;

// chrome.tabs.executeScript(
// 	tabId,
// 	{ code: actualCode, runAt: 'document_end' },
// 	cb
// );

// self.addEventListener('fetch', (e) => {
// 	console.log('XPTOOOOOOO');
// 	e.respondWith(fetch(e.request.url));
// })

// import {
// 	updateExtensionEnable,
// 	makeHttpRequest,
// 	showLog,
// } from './http-interceptor-cache-utils.js';

// chrome.action.onClicked.addListener((_tab) => {
// 	updateExtensionEnable();
// });

// export function fetch(e) {
// 	console.log({ e });
// 	return makeHttpRequest(...e);
// };

// chrome.webRequest.onBeforeRequest.addListener(
// 	(details) => {
// 		showLog({ details });
// 		return makeHttpRequest(details);
// 	},
// 	{ urls: ['<all_urls>'] }
// );

// chrome.action.onClicked.addListener((_tab) => {
// 	updateExtensionEnable();
// });

// chrome.storage.onChanged.addListener((changes, area) => {
// 	showLog('--- onChanged');
// 	showLog(changes.options);
// 	// if (area === 'sync' && changes.options?.newValue) {
// 	// 	updateExtensionEnable();
// 	// }
// });

// globalThis.fetchOriginal = globalThis.fetch;
// globalThis.fetchWithCache = (...e) => {
// 	showLog('--- respondWith mmmmm 123');
// 	return fetchOriginal(...e);
// };

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	console.log('=>>>>>>>>> onMessage ', message);
	// 2. A page requested user data, respond with a copy of `user`
	// if (message === 'http-interceptor-cache') {
	// 	const user = {
	// 		username: 'demo-user',
	// 	};
	// 	sendResponse(user);
	// }

	const currentTab = await chrome.tabs.getSelected();
	currentTab && injectCacheScriptOnHost(currentTab.id);

	console.log({ currentTab });

	sendResponse('ALLLL DONNEEEE');
});

chrome.windows.onFocusChanged.addListener(() => {
	// injectCacheScriptOnHost(tabId);

	// activeInfo.tabId;
});

chrome.tabs.onActivated.addListener((activeInfo) => {
	
});

(async function() {
	const currentTab = await chrome.tabs.getSelected();
	console.log({ currentTab });
})();

function injectCacheScriptOnHost(tabId) {
	chrome.scripting.executeScript({
		world: 'MAIN',
		injectImmediately: true,
		func: () => {
			const injectedScript = `
				console.log('--- injectedScript done');
				const monkeyPatch = () => {
					let oldXHROpen = window.XMLHttpRequest.prototype.open;
					window.XMLHttpRequest.prototype.open = function () {

						console.log('OKKKKKKKK');

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
