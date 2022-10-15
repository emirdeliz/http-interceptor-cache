'use strict';

const appendScriptHttpInterceptorCacheToHost = () => {
	if (window.httpInterceptorCacheScriptInitialized) {
		return;
	}

	const s = document.createElement('script');
	s.src = chrome.runtime.getURL('content-script.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

appendScriptHttpInterceptorCacheToHost();