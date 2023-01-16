import { test, expect } from '@tests-setup/fixtures';
import * as constants from '@tests/constants';

test('extension: make cache to GET', async function ({ page, extensionId }) {
	await page.goto(`chrome-extension://${extensionId}/dist/html/popup.html`, {
		waitUntil: 'load',
	});
	await page.getByTestId('btn-enable-disable-status').click();
	await page.getByLabel('GET').click();

	//www.w3schools.com/lib/w3codecolor.js

	https: await page.goto(constants.EXTENSION_TEST_SITE_BASE_URL);
	// await page.reload();
	const msgPromise = page.waitForEvent('console');

	// await page.goto(constants.EXTENSION_TEST_SITE_BASE_URL);
	// expect(page.url()).toBe('https://www.w3schools.com/');

	// console.log(page.context().browser());

	// await page.reload();
	// const currentTab = await utils.getCurrentTab();

	// expect(currentTab.active).toBeTruthy();
	// expect(currentTab.favIconUrl).toBe('https://www.w3schools.com/favicon.ico');
	// expect(currentTab.url).toBe('https://www.w3schools.com/');
	// expect(currentTab.title).toBe('W3Schools Online Web Tutorials');
});

// test('utils: initializeBroadcastChannelCache', async function ({
// 	page,
// 	extensionId,
// }) {
// 	// await page.goto(constants.EXTENSION_TEST_SITE_BASE_URL);
// 	const currentTab = utils.initializeBroadcastChannelCache();

// });
