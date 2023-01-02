// import { Page } from '@playwright/test';
import * as constants from '@scripts/constants';
import * as utils from '@scripts/utils';
import { test, expect } from '@tests-setup/fixtures';

test('popup page: render content', async ({ page, extensionId }) => {
	await page.goto(`chrome-extension://${extensionId}/dist/html/popup.html`);
	await expect(page.getByText('HTTP methods to apply:')).toBeVisible();
	await expect(
		page.getByText('Interceptor regex to apply cache')
	).toBeVisible();

	await expect(page.getByTestId('btn-enable-disable-status')).toBeVisible();
	await expect(page.getByText('GET')).toBeVisible();
	await expect(page.getByText('POST')).toBeVisible();
	await expect(page.getByText('PUT')).toBeVisible();
	await expect(page.getByText('DELETE')).toBeVisible();
	await expect(page.getByText('PATCH')).toBeVisible();
});

test('popup page: render the extension disabled', async ({
	page,
	extensionId,
}) => {
	await page.goto(`chrome-extension://${extensionId}/dist/html/popup.html`);
	await expect(page.getByRole('contentinfo')).toHaveCSS(
		'opacity',
		constants.EXTENSION_STATUS_OPACITY.Disabled
	);
	await expect(page.getByRole('contentinfo')).toHaveCSS(
		'pointer-events',
		constants.EXTENSION_STATUS_POINTER_EVENTS.Disabled
	);
	await expect(page.getByTestId('btn-enable-disable-status')).toBeEnabled();
});
