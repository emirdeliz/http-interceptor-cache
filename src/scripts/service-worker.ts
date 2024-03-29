import * as constants from '@scripts/constants';
import * as utils from '@scripts/utils';

async function updateToolbarIconByStatus(enabled: boolean) {
	chrome.action.setIcon({
		path: enabled
			? constants.EXTENSION_IMAGE_ENABLED_PATH
			: constants.EXTENSION_IMAGE_DISABLED_PATH,
	});
	await chrome.action.setBadgeText({
		text: enabled ? '' : 'Off',
	});
	return true;
}

chrome.tabs.onUpdated.addListener(async function () {
	const enabledKey = constants.EXTENSION_STATUS_KEY;
	const isEnabled = await utils.getStorageValue(enabledKey);
	await updateToolbarIconByStatus(isEnabled);
});

chrome.storage.onChanged.addListener(async function (changes) {
	for (const [, { newValue }] of Object.entries(changes)) {
		const isEnabled = newValue[constants.EXTENSION_STATUS_KEY];
		const isStatusChange = isEnabled != undefined;
		if (isStatusChange) {
			updateToolbarIconByStatus(isEnabled);
		}
	}
});