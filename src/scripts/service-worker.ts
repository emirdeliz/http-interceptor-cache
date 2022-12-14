import {
	EXTENSION_STATUS_KEY,
	EXTENSION_IMAGE_DISABLED_PATH,
	EXTENSION_IMAGE_ENABLED_PATH,
	MESSAGE_GET_STATE_KEY,
	MESSAGE_UPDATE_STATE_KEY,
} from '@scripts/constants';
import { ExtensionCache } from '@scripts/types';

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
	chrome.storage.local.get(key || null, function (cache) {
		callback && callback({ ...cache, channel });
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
	key: string;
	channel?: string;
	value: string | boolean | Response;
	callback?: Function;
}) {
	chrome.storage.local.set({ [key]: value }, function () {
		callback && callback({ value, channel });
	});
	if (chrome.runtime.lastError) {
		console.warn(
			`Error setting ${key} to ${value}: ${chrome.runtime.lastError.message}`
		);
	}
	return true;
}

function updateToolbarIconByStatus({ enabled }: { enabled?: boolean }) {
	chrome.action.setIcon({
		path: enabled
			? EXTENSION_IMAGE_ENABLED_PATH
			: EXTENSION_IMAGE_DISABLED_PATH,
	});
	chrome.action.setBadgeText({
		text: enabled ? '' : 'Off',
	});
	return true;
}

chrome.tabs.onUpdated.addListener(() => {
	getCacheValue({
		key: EXTENSION_STATUS_KEY,
		callback: function (cache: ExtensionCache) {
			updateToolbarIconByStatus({ enabled: cache[EXTENSION_STATUS_KEY] });
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
