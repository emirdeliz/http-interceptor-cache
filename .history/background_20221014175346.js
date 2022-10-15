// import {
// 	updateExtensionEnable,
// 	makeHttpRequest,
// 	showLog,
// } from './http-interceptor-cache-utils.js';

// async function requestWithCacheProxy(sendResponse) {
// 	sendResponse({ ret: 'Valor correto' });
// }

// chrome.runtime.onMessage.addListener(async (message, _sender, sendResponse) => {
// 	console.log({
// 		message,
// 	});
// 	switch (message.messageId) {
// 		case 'http-interceptor-cache-initialize':
// 			// injectCacheScriptOnHost();
// 			break;
// 		case 'http-interceptor-cache-request':
// 			requestWithCacheProxy(sendResponse);
// 			break;
// 		default:
// 			break;
// 	}
// });

if (!this.document) {
	self.addEventListener('install', function (e) {
		console.log('service worker installation');
	});
} else {
	navigator.serviceWorker.register('background.js');
}