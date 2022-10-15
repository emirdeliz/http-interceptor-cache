let status = true;
// set toggle of extension on browser action click and notify content script
chrome.browserAction.onClicked.addListener(function (tabs) {
	if (status) {
		status = false;
		chrome.browserAction.setIcon({ path: 'icons/16x16.png' });
	} else {
		status = true;
		chrome.browserAction.setIcon({ path: 'icons/icon-active.png' });
	}
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { status: status });
	});
});

// check status on tab update and notify content script
chrome.tabs.onActivated.addListener(function () {
	if (status) {
		chrome.browserAction.setIcon({ path: 'icons/icon-active.png' });
	} else {
		chrome.browserAction.setIcon({ path: 'icons/16x16.png' });
	}
	chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
		chrome.tabs.sendMessage(tabs[0].id, { status: status });
	});
});

//send extension status on request
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.status == 'getStatus') sendResponse({ status: status });
});
