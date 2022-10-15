'use strict';

function initializeHttpCache() {
	const s = document.createElement('script');
	s.src = chrome.runtime.getURL('src/js/injectDOM.js');
	s.onload = function () {
		this.remove();
	};
	(document.head || document.documentElement).appendChild(s);
}

initializeHttpCache();