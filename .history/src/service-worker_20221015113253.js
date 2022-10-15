chrome.browserAction.onClicked.addListener(function (tab) {
	chrome.tabs.insertCSS(tab.id, { file: 'content_style.css' });
	chrome.tabs.executeScript(tab.id, { file: 'content_script.js' });
});
