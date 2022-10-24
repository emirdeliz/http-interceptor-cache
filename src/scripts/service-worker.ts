import {
	APP_NAME,
	IMAGE_DISABLED_PATH,
	IMAGE_ENABLED_PATH,
	MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
	MESSAGE_GET_STATE_KEY,
	MESSAGE_UPDATE_STATE_KEY,
} from './constants';

chrome.runtime.onMessage.addListener(async function(request, _sender, sendResponse) {
	const { messageKey, key, value } = request;
	switch (messageKey) {
		case MESSAGE_GET_STATE_KEY:
			sendResponse(await getCacheValue(key));
		case MESSAGE_UPDATE_STATE_KEY:
			sendResponse(await setCacheValue(key, value));
		case MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY: {
			await updateStatus(value);
			sendResponse(await setCacheValue('enabled', value));
		}
	}
	return true;
});

async function getCacheValue(key: string) {
	const keyWithAppName = `${APP_NAME}-${key}`;
	const value = await chrome.storage.local.get(keyWithAppName);
	
	if (chrome.runtime.lastError) {
		console.error(
			`Error setting ${key} to ${value}: ${chrome.runtime.lastError.message}`
		);
	}
	return value[keyWithAppName];
}

async function setCacheValue(key: string, value: string|boolean) {
	await chrome.storage.local.set({ [`${APP_NAME}-${key}`]: value })
	if (chrome.runtime.lastError) {
		console.error(
			`Error setting ${key} to ${value}: ${chrome.runtime.lastError.message}`
		);
	}
	return true;
}

async function updateStatus(enabled: boolean) {
	if (enabled) {
		chrome.action.setIcon({ path: IMAGE_ENABLED_PATH });
	} else {
		chrome.action.setIcon({ path: IMAGE_DISABLED_PATH });
	}
	return true;
}

// chrome.tabs.onActivated.addListener(async function (_activeInfo) {
// 	const enabled = await getCacheValue(MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY);
// 	updateStatus(enabled);
// });
