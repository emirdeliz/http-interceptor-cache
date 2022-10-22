import {
	getExtensionStatusByTab,
	setExtensionStatusByTab,
	injectScript,
} from './utils';
import {
	MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY,
	MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
	SERVICE_WORKER_SCRIPT_ID,
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
	await injectScript({
		path: 'dist/scripts/service-worker.js',
		type: 'javascript/worker',
		id: SERVICE_WORKER_SCRIPT_ID,
	});
};
appendScriptHttpInterceptorCacheToHost();

// fetch('chrome-extension://gbnjnikpmojonmejodjfemmbcmkcjkmi/dist/scripts/service-worker.js')
// 	.then(function (response) {
// 		console.log({ response });
// 		return response.te();
// 	})
// 	.then(function (myBlob) {
// 		console.log({ myBlob });
// 	});