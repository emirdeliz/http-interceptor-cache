import {
	IMAGE_DISABLED_PATH,
	IMAGE_ENABLED_PATH,
	MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
	MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY,
} from './constants';

const getExtensionStatusByTab = (
	tabId: number,
	callback: (isEnabled: boolean) => void
) => {
	chrome.tabs.sendMessage(
		tabId,
		{
			messageKey: MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
			tabId,
		},
		(response) => {
			callback(response?.isEnabled);
		}
	);
};

const setExtensionStatusByTab = (tabId: number, isEnabled: boolean) => {
	chrome.tabs.sendMessage(tabId, {
		messageKey: MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY,
		isEnabled,
		tabId,
	});
};

const updateStatus = (tabId: number, isEnabled: boolean) => {
	if (isEnabled) {
		chrome.action.setIcon({ path: IMAGE_DISABLED_PATH });
	} else {
		chrome.action.setIcon({ path: IMAGE_ENABLED_PATH });
	}
	setExtensionStatusByTab(tabId, isEnabled);
};

chrome.action.onClicked.addListener(async (tab) => {
	const tabId = tab.id;
	tabId &&
		getExtensionStatusByTab(tabId, (isEnabled) => {
			updateStatus(tabId, !isEnabled);
		});
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
	const tabId = activeInfo.tabId || 0;
	getExtensionStatusByTab(tabId, (isEnabled) => {
		if (isEnabled) {
			chrome.action.setIcon({ path: IMAGE_DISABLED_PATH });
		} else {
			chrome.action.setIcon({ path: IMAGE_ENABLED_PATH });
		}
		setExtensionStatusByTab(tabId, isEnabled);
	});
});
