'use strict';

function makeProxy() {
	const oldXHROpen = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function() {
		this.addEventListener('load', function () {
			return new Promise(function (resolve) {
				chrome.runtime.sendMessage(
					'gbnjnikpmojonmejodjfemmbcmkcjkmi',
					{ messageId: 'http-interceptor-cache-request' },
					(response) => {
						console.log('received data', response);
						resolve(response);
					}
				);
			});
		});
		return oldXHROpen.apply(this, arguments);
	};
}

function makeRequest() {
	this.addEventListener('load', function () {
		return new Promise(function (resolve) {
			chrome.runtime.sendMessage(
				'gbnjnikpmojonmejodjfemmbcmkcjkmi', 
				{ messageId: 'http-interceptor-cache-request' }, 
				(response) => {
					console.log('received data', response);
					resolve(response);
				}
			)
		});
	});
	return oldXHROpen.apply(this, arguments);
}

function initializeHttpCache() {
	chrome.runtime.sendMessage({ 
		messageId: 'http-interceptor-cache-initialize',
		function() {}
	});
}

initializeHttpCache();
// function initializeHttpCache() {
// 	const injectedScript = `
// 		const monkeyPatch = () => {
// 			let oldXHROpen = window.XMLHttpRequest.prototype.open;
// 			window.XMLHttpRequest.prototype.open = function () {
// 				this.addEventListener('load', function () {
// 					// const responseBody = this.responseText;
// 					// document.getElementById('myDataHolder').setAttribute('myData', responseBody)
// 				});
// 				return oldXHROpen.apply(this, arguments);
// 			};
// 		};
// 		monkeyPatch();
// `;

// 	const script = document.createElement('script');
// 	script.nonce = 'gbnjnikpmojonmejodjfemmbcmkcjkmi';
// 	script.textContent = injectedScript;
// 	(document.head || document.documentElement).appendChild(script);
// 	script.remove();
// }

// (function () {
// 	console.log('Script Injected');
// 	initializeHttpCache();
// })();

// navigator.serviceWorker
// 	.register('http-interceptor-cache-service-worker.js')
// 	.then((x) => console.log('done', x));

// import './src/js/http-interceptor-cache.js';

// const showLog = (msg) => {
// 	console.log(msg);
// 	console.log('');
// 	console.log('');
// };

// const fetchOriginal = window.fetch;
// window.fetch = (...e) => {
// 	showLog('--- respondWith mmmmm');

// 	return fetchOriginal(...e);
// };

// showLog('--- respondWith mmmmm');

// // "content_scripts": [
// // 	{
// // 		"js": [
// // 			"index.js"
// // 		],
// // 		"matches": ["https://*/*"]
// // 	}
// // ],

// window.fetch = (...e) => {
// 	console.log('---- window.fetch');
// 	return new Promise((resolve) => {
// 		console.log('---- resolve');
// 		chrome.runtime.sendMessage('http-interceptor-cache', (response) => {
// 			console.log('---- DONNNNEEEE');

// 			// 3. Got an asynchronous response with the data from the service worker
// 			console.log('received data', response);
// 			resolve();
// 		});
// 	});
// };

// const registerServiceWorker = async () => {
// 	const workerPath = chrome.runtime.getURL('src/js/http-interceptor-cache-service-worker.js');
// 	console.log({
// 		workerPath,
// 	});
// 	if ('serviceWorker' in navigator) {
// 		try {
// 			const registration = await navigator.serviceWorker.register(
// 				workerPath, {
// 				scope: '/',
// 			});
// 			if (registration.installing) {
// 				console.log('Service worker installing');
// 			} else if (registration.waiting) {
// 				console.log('Service worker installed');
// 			} else if (registration.active) {
// 				console.log('Service worker active');
// 			}
// 		} catch (error) {
// 			console.error(`Registration failed with ${error}`);
// 		}
// 	}
// };

// window.addEventListener('load', registerServiceWorker);

// "content_scripts": [
// 		{
// 			"js": [
// 				"src/js/http-interceptor-cache-service-worker.js",
// 				"src/js/index.js"
// 			],
// 			"matches": [
// 				"https://*/*"
// 			]
// 		}
// 	],

// const s = document.createElement('script');
// s.src = chrome.extension.getURL('http-interceptor-cache-utils-capture.js');
// s.onload = function () {
// 	this.remove();
// };
// (document.head || document.documentElement).appendChild(s);