chrome.action.onClicked.addListener((tabs) => {
	const tabId = tabs[0].id;
	chrome.action.isEnabled(tabId, (isEnabled) => {
		if (isEnabled) {
			chrome.action.disable(tabId, () => {
				chrome.action.setIcon({ path: 'images/icon-16-disabled.png' });
			});
		} else {
			chrome.action.enable(tabId, () => {
				chrome.action.setIcon({ path: 'images/icon-16.png' });
			});
		}
	});

	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { extensionEnable: extensionEnable });
	});
});

chrome.tabs.onActivated.addListener(() => {
	chrome.action.isEnabled(tabId, (isEnabled) => {
		if (isEnabled) {
			chrome.action.setIcon({ path: 'images/icon-16-disabled.png' });
		} else {
			chrome.action.setIcon({ path: 'images/icon-16.png' });
		}
	});
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.tabs.sendMessage(tabs[0].id, { extensionEnable: extensionEnable });
	});
});

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
	if (request.extensionEnable == 'getExtensionEnable') {
		sendResponse({ extensionEnable: extensionEnable });
	}
});
