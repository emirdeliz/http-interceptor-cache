addEventListener('fetch', (e) =>
	e.respondWith(
		fetch(/*btw xhr is undefined*/ e.request).then((r) => {
			if (r.headers === undefined /*request not end with <.htm>, <.html>*/) {
			} else {
				console.assert(
					r.headers.get('content-type') === null
				); /*for some odd reason this is empty*/ //[
				let h = new Headers();
				r.headers.forEach((v, k) => h.append(k, v));
				Object.defineProperty(r, 'headers', { writable: true });
				r.headers = h;
				r.headers.append('content-type', 'text/html' /*btw <htm> doesnt work*/);
				//]
			}
			return r.text().then((_) => new Response(_.replace(/cat/g, 'dog'), r));
		})
	)
);

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

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	console.log('=>>>>>>>>>', message);
// 	// 2. A page requested user data, respond with a copy of `user`
// 	if (message === 'http-interceptor-cache') {
// 		const user = {
// 			username: 'demo-user',
// 		};
// 		sendResponse(user);
// 	}
// });

// chrome.tabs.onActivated.addListener((activeInfo) => {
// 	chrome.scripting.executeScript({
// 		target: { tabId: activeInfo.tabId },
// 		func: () => {
// 			console.log('---- ENTROU');
// 			window.addEventListener('load', () => {
// 				window.fetch = (...e) => {
// 					console.log('---- window.fetch');
// 					return new Promise((resolve) => {
// 						console.log('---- resolve');
// 						chrome.runtime.sendMessage('http-interceptor-cache', (response) => {
// 							console.log('---- DONNNNEEEE');
// 							// 3. Got an asynchronous response with the data from the service worker
// 							console.log('received data', response);
// 							resolve();
// 						});
// 					});
// 				};
// 			});
// 		},
// 	});
// });

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
