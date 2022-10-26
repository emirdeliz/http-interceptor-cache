import { EXTENSION_NAME } from './constants';
import {
	initializeBroadcastChannelCache,
	injectScript,
} from './utils';

const scriptId = `${EXTENSION_NAME}-content`;

async function appendScriptHttpInterceptorCacheToHost() {
	initializeBroadcastChannelCache();
	await injectScript({ path: 'dist/scripts/constants.js' });
	await injectScript({ path: 'dist/scripts/content-script.js', id: scriptId });
}
appendScriptHttpInterceptorCacheToHost();