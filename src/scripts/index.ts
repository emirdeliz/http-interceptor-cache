import * as constants from '@scripts/constants';
import * as types from '@scripts/types';
import * as utils from '@scripts/utils';

const scriptId = `${constants.EXTENSION_NAME}-content`;
async function appendScriptHttpInterceptorCacheToHost() {
	await utils.injectScript({ path: 'dist/scripts/content.js', id: scriptId });

	const config = await utils.getStorageValue();
	sendMessageToClient(config);
	initializeUpdate();
}

async function initializeUpdate() { 
	chrome.storage.sync.onChanged.addListener(function (data) {
		sendMessageToClient(data[constants.EXTENSION_NAME].newValue);
	});
}

async function sendMessageToClient(message: types.ExtensionCache) { 
	const broadcast = new BroadcastChannel(constants.MESSAGE_UPDATE_STATE_KEY);
	broadcast.postMessage(message);
	broadcast.close();
}

appendScriptHttpInterceptorCacheToHost();