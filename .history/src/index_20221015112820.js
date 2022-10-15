'use strict';

// chrome.action.onClicked.addListener((_tab) => {
// 	console.log('CLICKKKKKK');
// });

chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.insertCSS(tab.id, { file: 'content_style.css' });
	chrome.tabs.executeScript(tab.id, { file: 'content_script.js' });
});

const appendScriptHttpInterceptorCacheToHost = () => {
	const s = document.createElement('script');
	s.src = chrome.runtime.getURL('content-script.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}
appendScriptHttpInterceptorCacheToHost();

document.addEventListener('click', () => {
	chrome.storage.local.get('enabled', (data) => {
		if (data.enabled) {
			console.log('HALAMMMM');
			//it is enabled, do accordingly
		} else {
			//it is disabled
		}
	});
});
