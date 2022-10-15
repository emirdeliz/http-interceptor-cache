chrome.action.onClicked.addListener(function (tab) {
	chrome.tabs.insertCSS(tab.id, { file: 'content_style.css' });
	chrome.tabs.executeScript(tab.id, { file: 'content_script.js' });
});

// chrome.tabs.onActiveChanged.addListener(function (tabId) {
// 	if (activedTab[tabId]) {
// 		chrome.browserAction.setIcon({ path: 'icons/icon_16.png' });
// 	} else {
// 		chrome.browserAction.setIcon({ path: 'icons/icon_16_disabled.png' });
// 	}
// });