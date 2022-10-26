import {
	EXTENSION_STATUS_KEY,
	IMAGE_DISABLED_PATH,
	IMAGE_ENABLED_PATH,
	MESSAGE_GET_STATE_KEY,
	MESSAGE_UPDATE_STATE_KEY,
} from './constants';

function processMessage(request: any, sendResponse: Function) {
	const { channel, key, value } = request;
	try {
		switch (channel) {
			case MESSAGE_GET_STATE_KEY:
				getCacheValue({ key, channel, callback: sendResponse });
				break;
			case MESSAGE_UPDATE_STATE_KEY: {
				setCacheValue({ key, channel, value, callback: sendResponse });
				break;
			}
		}
	} catch (e) {
		console.warn({ e });
	}
	return true;
}

function getCacheValue({
	key,
	channel,
	callback,
}: {
	key?: string;
	channel?: string;
	callback?: Function;
}) {
	chrome.storage.local.get(key || null, function (result) {
		callback && callback({ ...result, channel });
	});

	if (chrome.runtime.lastError) {
		console.warn(
			`Error setting ${key} to ${key}: ${chrome.runtime.lastError.message}`
		);
	}
	return true;
}

function setCacheValue({
	key,
	value,
	channel,
	callback,
}: {
	key: string,
	channel?: string,
	value: string | boolean | Response
	callback?: Function
}) {
	chrome.storage.local.set({ [key]: value },
		function () {
			callback && callback({ value, channel });
		}
	);
	if (chrome.runtime.lastError) {
		console.warn(
			`Error setting ${key} to ${value}: ${chrome.runtime.lastError.message}`
		);
	}
	return true;
}

function updateToolbarIconByStatus({ enabled}: { enabled: boolean }) {
	if (enabled) {
		chrome.action.setIcon({ path: IMAGE_ENABLED_PATH });
	} else {
		chrome.action.setIcon({ path: IMAGE_DISABLED_PATH });
	}
	return true;
}

chrome.tabs.onActivated.addListener(function (_activeInfo) {
	getCacheValue({
		key: EXTENSION_STATUS_KEY,
		callback: function(enabled: boolean) {
			updateToolbarIconByStatus({ enabled });
		},
	});
});

chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
	return processMessage(request, sendResponse);
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
	for (let [key, { newValue }] of Object.entries(changes)) {
		const isStatusChange = EXTENSION_STATUS_KEY === key;
		if (isStatusChange) {
			updateToolbarIconByStatus({ enabled: newValue });
		}
	}
});