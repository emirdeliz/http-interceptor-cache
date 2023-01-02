// import { Page } from '@playwright/test';
import * as constants from '@scripts/constants';
import * as utils from '@scripts/utils';
import { test, expect } from '@tests-setup/fixtures';

function buildExtensionPopupUrl(extensionId: string) {
	return `chrome-extension://${extensionId}/dist/html/popup.html`;
}

test('popup page: render content', async function ({ page, extensionId }) {
	await page.goto(buildExtensionPopupUrl(extensionId));
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

test('popup page: render the extension disabled', async function ({
	page,
	extensionId,
}) {
	await page.goto(buildExtensionPopupUrl(extensionId));
	const contentInfoContainer = page.getByRole('contentinfo');
	await expect(contentInfoContainer).toHaveCSS(
		'opacity',
		constants.EXTENSION_STATUS_OPACITY.Disabled
	);
	await expect(contentInfoContainer).toHaveCSS(
		'pointer-events',
		constants.EXTENSION_STATUS_POINTER_EVENTS.Disabled
	);
	await expect(page.getByTestId('btn-enable-disable-status')).toBeEnabled();
});

test('popup page: enable the extension and then disabled', async function ({
	page,
	extensionId,
}) {
	await page.goto(buildExtensionPopupUrl(extensionId));
	const contentInfoContainer = page.getByRole('contentinfo');
	await expect(page.getByTestId('btn-enable-disable-status')).toBeEnabled();

	await page.getByTestId('btn-enable-disable-status').click();
	await expect(contentInfoContainer).toHaveCSS(
		'opacity',
		constants.EXTENSION_STATUS_OPACITY.Enabled
	);
	await expect(contentInfoContainer).toHaveCSS(
		'pointer-events',
		constants.EXTENSION_STATUS_POINTER_EVENTS.Enabled
	);

	const cbxPost = page.getByLabel('POST');
	await expect(cbxPost).toBeEditable();

	await cbxPost.click();
	await expect(cbxPost).toBeChecked();

	await page.getByTestId('btn-enable-disable-status').click();
	await cbxPost.click({ force: true });
	await expect(cbxPost).toBeChecked();

	await expect(contentInfoContainer).toHaveCSS(
		'opacity',
		constants.EXTENSION_STATUS_OPACITY.Disabled
	);
	await expect(contentInfoContainer).toHaveCSS(
		'pointer-events',
		constants.EXTENSION_STATUS_POINTER_EVENTS.Disabled
	);
});

test('popup page: enable extension', async function ({ page, extensionId }) {
	await page.goto(buildExtensionPopupUrl(extensionId));
	const contentInfoContainer = page.getByRole('contentinfo');
	await page.getByTestId('btn-enable-disable-status').click();

	await expect(contentInfoContainer).toHaveCSS(
		'opacity',
		constants.EXTENSION_STATUS_OPACITY.Enabled
	);
	await expect(contentInfoContainer).toHaveCSS(
		'pointer-events',
		constants.EXTENSION_STATUS_POINTER_EVENTS.Enabled
	);
});

test('popup page: set the intercept to POST with regex /aquecimentofake/', async function ({
	page,
	extensionId,
}) {
	await page.goto(buildExtensionPopupUrl(extensionId));
	await page.getByTestId('btn-enable-disable-status').click();

	const cbxPost = page.getByLabel('POST');
	await expect(cbxPost).toBeEditable();

	await cbxPost.click();
	await expect(cbxPost).toBeChecked();

	const inputRegex = page.getByLabel('Interceptor regex to apply cache');
	await expect(inputRegex).toBeEditable();

	await inputRegex.fill('/aquecimentofake/');
	expect(await inputRegex.inputValue()).toBe('/aquecimentofake/');
});

test('popup page: set the intercept to POST with regex /aquecimentofake/ and then reset to default values', async function ({
	page,
	extensionId,
}) {
	await page.goto(buildExtensionPopupUrl(extensionId));
	await page.getByTestId('btn-enable-disable-status').click();

	const cbxPost = page.getByLabel('POST');
	await expect(cbxPost).toBeEditable();

	await cbxPost.click();
	await expect(cbxPost).toBeChecked();

	await cbxPost.click();
	await expect(cbxPost).not.toBeChecked();

	const inputRegex = page.getByLabel('Interceptor regex to apply cache');
	await expect(inputRegex).toBeEditable();

	await inputRegex.fill('/aquecimentofake/');
	expect(await inputRegex.inputValue()).toBe('/aquecimentofake/');

	await inputRegex.fill('');
	expect(await inputRegex.inputValue()).toBe('');
});
