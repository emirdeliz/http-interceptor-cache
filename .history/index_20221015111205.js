'use strict';

chrome.action.onClicked.addListener((_tab) => {
	updateExtensionEnable();
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
