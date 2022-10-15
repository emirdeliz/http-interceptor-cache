'use strict';
const appendScriptHttpInterceptorCacheToHost = () => {
	const s = document.createElement('script');
	s.src = chrome.runtime.getURL('background.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

appendScriptHttpInterceptorCacheToHost();