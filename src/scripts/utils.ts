import * as constants from '@scripts/constants';

export async function getCurrentTab() {
	const tabsId = await chrome.tabs.query({
		currentWindow: true,// Filters tabs in current window
    active: true, // The tab or web page is browsed at this state,
	});
	const currentTab = tabsId[0];
	return currentTab;
}

export async function getStorageValue<T>(key?: keyof typeof constants | string) {
	const data = await chrome.storage.sync.get();
	const extensionData = data[constants.EXTENSION_NAME] || {};
	return key ? extensionData[key] as T : extensionData;
}

export async function setStorageValue(key: keyof typeof constants | string, value: string | boolean | Response) {
	const data = await chrome.storage.sync.get();
	const currentState = data[constants.EXTENSION_NAME];
	await chrome.storage.sync.set({[constants.EXTENSION_NAME]: {
		...currentState, [key]: value 
	}
	});
}

export function getCheckboxKey(cbx: HTMLInputElement) {
	const checkboxLabel = cbx.parentNode?.querySelector<HTMLLabelElement>('label');
	const checkboxKey = checkboxLabel?.innerHTML;
	return `${constants.EXTENSION_NAME}-${checkboxKey}` as keyof typeof constants;
}

export function injectScript({
	path,
	type,
	id,
}: {
	path?: string;
	type?: string;
	id?: string;
}) {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script');
		if (id) {
			script.id = id;
		}
		if (path) {
			script.src = chrome.runtime.getURL(path);
		}

		script.type = type || 'text/javascript';
		script.onload = () => {
			resolve();
			script.remove();
		};
		(document.head || document.documentElement).appendChild(script);
	});
}