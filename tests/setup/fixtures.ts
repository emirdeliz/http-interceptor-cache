import * as playwright from '@playwright/test';

import path from 'path';

export const test = playwright.test.extend<{
	context: playwright.BrowserContext;
	extensionId: string;
}>({
	context: async (_c, use) => {
		const pathToExtension = path.resolve(path.dirname(''));
		const context = await playwright.chromium.launchPersistentContext('', {
			headless: false,
			args: [
				`--disable-extensions-except=${pathToExtension}`,
				`--load-extension=${pathToExtension}`,
			],
		});
		await use(context);
		await context.close();
	},
	extensionId: async ({ context }, use) => {
		let [background] = context.serviceWorkers();
		if (!background) {
			background = await context.waitForEvent('serviceworker');
		}

		const extensionId = background.url().split('/')[2];
		await use(extensionId);
	},
});
export const expect = test.expect;
