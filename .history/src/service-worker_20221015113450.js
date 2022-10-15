chrome.tabs.onActiveChanged.addListener(function (tabId) {
	if (activedTab[tabId]) {
		chrome.browserAction.setIcon({ path: 'icons/icon_16.png' });
	} else {
		chrome.browserAction.setIcon({ path: 'icons/icon_16_disabled.png' });
	}
});
