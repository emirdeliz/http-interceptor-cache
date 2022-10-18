import {
	getExtensionStatusByTab,
	setExtensionStatusByTab,
	injectScript,
} from './utils';
import {
	MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY,
	MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
} from './constants';

chrome.runtime.onMessage.addListener(async (request, _sender, sendResponse) => {
	const { messageKey, isEnabled, tabId } = request || {};
	if (messageKey == MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY) {
		const isEnabled = getExtensionStatusByTab(tabId);
		sendResponse({ isEnabled });
	} else if (messageKey === MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY) {
		setExtensionStatusByTab(tabId, isEnabled);
	}
});

const appendScriptHttpInterceptorCacheToHost = async () => {
	await injectScript({ path: 'dist/scripts/constants.js' });
	await injectScript({ path: 'dist/scripts/content-script.js' });
};
appendScriptHttpInterceptorCacheToHost();