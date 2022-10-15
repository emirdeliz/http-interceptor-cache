'use strict';

const HTTP_INTERCEPTOR_CACHE_SCRIPT_ID = 'http-interceptor-cache-script';

const appendScriptHttpInterceptorCacheToHost = () => {
	const hasScript = !!document.getElementById(HTTP_INTERCEPTOR_CACHE_SCRIPT_ID);
	if (hasScript) {
		return;
	}

	const s = document.createElement('script');
	s.id = 'http-interceptor-cache-script';
	s.src = chrome.runtime.getURL('content-script.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

appendScriptHttpInterceptorCacheToHost();