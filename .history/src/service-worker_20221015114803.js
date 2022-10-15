let extensionEnable = true;
// set toggle of extension on browser action click and notify content script
chrome.browserAction.onClicked.addListener(function (tabs) {
	if (extensionEnable) {
		extensionEnable = false;
		chrome.browserAction.setIcon({ path: 'images/icon-16-disabled.png' });
	} else {
		extensionEnable = true;
		chrome.browserAction.setIcon({ path: 'images/icon-16.png' });
	}
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { extensionEnable: extensionEnable });
	});
});

// check extensionEnable on tab update and notify content script
chrome.tabs.onActivated.addListener(function () {
	if (extensionEnable) {
		chrome.browserAction.setIcon({ path: 'images/icon-16-disabled.png' });
	} else {
		chrome.browserAction.setIcon({ path: 'images/icon-16.png' });
	}
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { extensionEnable: extensionEnable });
	});
});

//send extension extensionEnable on request
chrome.runtime.onMessage.addListener(function (request, _sender, sendResponse) {
	if (request.extensionEnable == 'getextensionEnable') sendResponse({ extensionEnable: extensionEnable });
});
