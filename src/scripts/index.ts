import { getExtensionState, injectScript } from './utils';

getExtensionState('regex', function (value: string) {
	// @ts-ignore
	window.httpInterceptorCacheRegex = value;
});

getExtensionState('enabled', function (enabled: boolean) {
	// console.log({ enabled });
});

const appendScriptHttpInterceptorCacheToHost = async () => {
	await injectScript({ path: 'dist/scripts/constants.js' });
	await injectScript({ path: 'dist/scripts/content-script.js' });
};
appendScriptHttpInterceptorCacheToHost();