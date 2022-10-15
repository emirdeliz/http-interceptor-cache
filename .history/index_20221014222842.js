'use strict';

const appendScriptHttpInterceptorCacheToHost = () => {
	const s = document.createElement('script');
	s.src = chrome.runtime.getURL('content-script.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

chrome.storage.local.get('enabled', (data) => {
	if (data.enabled) {
		//it is enabled, do accordingly
	} else {
		//it is disabled
	}
});

appendScriptHttpInterceptorCacheToHost();