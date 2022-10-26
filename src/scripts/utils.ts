import {
	MESSAGE_GET_STATE_KEY, 
	MESSAGE_UPDATE_STATE_KEY,
} from './constants';

export function initializeBroadcastChannelCache() {
	const channelGetState = initializeBroadcastMessageCacheResponse({
		channel: MESSAGE_GET_STATE_KEY,
		callback: function (e: MessageEvent) {
			if (chrome.runtime.id == undefined) {
				return;
			}
			chrome.runtime.sendMessage(
				{
					...e.data,
					channel: MESSAGE_GET_STATE_KEY,
				},
				function (response) {
					sendBroadcastMessageCache({
						channel: `${MESSAGE_GET_STATE_KEY}-${e.data.key || 'ALL'}`,
						message: response
				});
				}
			)
		}
	});

	const channelUpdateState = initializeBroadcastMessageCacheResponse({
		channel: MESSAGE_UPDATE_STATE_KEY,
		callback: function (e: MessageEvent) {
			if (chrome.runtime.id == undefined) {
				return;
			}
			chrome.runtime.sendMessage(
				{
					...e.data,
					channel: MESSAGE_UPDATE_STATE_KEY,
				},
				function (response) {
					sendBroadcastMessageCache({
						channel: `${MESSAGE_UPDATE_STATE_KEY}-${e.data.key || 'ALL'}`,
						message: response
					});
				}
			);
		}
	});

	window.addEventListener('beforeunload', function() {
		channelGetState.close();
		channelUpdateState.close();
	});
}

export function sendBroadcastMessageCache({ channel, message, callback }: {
	channel: string | BroadcastChannel,
	message: any,
	callback?: Function
}) {
	const isChannelBroadcast = channel instanceof BroadcastChannel;
	const bc = isChannelBroadcast ? channel : new BroadcastChannel(channel);
	const channelName = isChannelBroadcast ? channel.name : channel;
	
	const messageData = JSON.parse(JSON.stringify(message || { channel: '' }));
	messageData.channel = channelName;
	bc.postMessage(messageData);

	if (!isChannelBroadcast) {
		bc.close();
	}
	callback && callback();
}

export function initializeBroadcastMessageCacheResponse({
	channel,
	callback,
}: {
	channel: string;
	callback?: Function;
}) {
	const bc = new BroadcastChannel(channel);
	bc.onmessage = function (e: MessageEvent) {
		return callback && callback(e);
	};
	return bc;
}

export function sendBroadcastMessageCacheAndWaitResponse({
	channel,
	message,
	callback
}: {
	channel: string,
	message?: any,
	callback?: Function
}) {
	const { key } = message || {};
	const bc = initializeBroadcastMessageCacheResponse({
		channel: `${channel}-${key || 'ALL'}`,
		callback: function (e: MessageEvent) {
			callback && callback(e, message);
			bc.close();
		},
	});
	sendBroadcastMessageCache({ channel, message });
}

export function getCurrentTab() {
	return new Promise<chrome.tabs.Tab>((resolve) => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			resolve(tabs[0] as chrome.tabs.Tab);
		});
	});
}

export async function getFromCache<T>(key: string) {
	return new Promise<T>(function (resolve, reject) {
		try {
			sendBroadcastMessageCacheAndWaitResponse({
				channel: MESSAGE_GET_STATE_KEY,
				message: { key },
				callback: function (e: MessageEvent) {
					resolve(e.data[key]);
				}
			});
		} catch (e) {
			console.warn('Error - GET cache: ', e);
			reject('Error - GET cache');
		}
	});
}

export async function putInCache(
	key: RequestInfo | URL | string,
	value: Response | string | boolean
) {
	return new Promise<void>(function (resolve, reject) {
		try {
			sendBroadcastMessageCache({
				channel: MESSAGE_UPDATE_STATE_KEY,
				message: {
					key,
					value,
				},
				callback: resolve
		});
		} catch (e) {
			console.warn('Error - SET cache: ', e);
			reject('Error - SET cache');
		}
	});
}

export function injectScript({ path, type, id }: { path?: string; type?: string; id?: string; }) {
	return new Promise<void>((resolve) => {
		const script = document.createElement('script');
		if (id) {
			script.id = id;
		}
		if (path) {
			script.src = chrome.runtime.getURL(path);
		}

		script.type = type || "text/javascript";
		script.onload = () => {
			resolve();
			script.remove();
		};
		(document.head || document.documentElement).appendChild(script);
	});
}

export async function injectCss({ path }: { path: string; }) {
	const style = document.createElement('link');
	style.id = chrome.runtime.id;
	style.href = chrome.runtime.getURL(path);
	style.rel = 'stylesheet';
	document.documentElement.appendChild(style);
}
