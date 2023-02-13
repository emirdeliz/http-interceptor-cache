import * as constants from '@scripts/constants';
import * as utils from '@scripts/utils';

window.addEventListener(
	'load',
	function () {
		initializeHttpInputRegex();
		initializeHttpCheckbox();
		initializeHttpStatus();
	},
	false
);

async function updateConfigOnClient(key: string, value: string|boolean) { 
	const broadcastUpdate = new BroadcastChannel(constants.MESSAGE_UPDATE_STATE_KEY);
	broadcastUpdate.postMessage({ [key]: value });
	broadcastUpdate.close();
}

async function initializeHttpInputRegex() {
	const inputRegex = document.querySelector<HTMLInputElement>('[type=text]');
	if (inputRegex) {
		inputRegex.value = await utils.getStorageValue<string>(constants.EXTENSION_REGEX_KEY);
	}

	const btnSaveRegex = document.querySelector<HTMLButtonElement>('#btn-save-regex');
	btnSaveRegex?.addEventListener(
		'click',
		function () {
			showButtonStatus(
				btnSaveRegex,
				utils.setStorageValue(constants.EXTENSION_REGEX_KEY, inputRegex?.value || '')
			);
			updateConfigOnClient(constants.EXTENSION_REGEX_KEY, inputRegex?.value || '');
		},
		false
	);
}

function initializeHttpCheckbox() {
	const checkboxHttp = document.querySelectorAll<HTMLInputElement>('[type=checkbox]');
	checkboxHttp.forEach(async function (cbx) {
		const checkboxKey = utils.getCheckboxKey(cbx);
		cbx.addEventListener('click', function () {
			utils.setStorageValue(checkboxKey, cbx.checked);
			updateConfigOnClient(checkboxKey, cbx.checked);
		});
		cbx.checked = await utils.getStorageValue<boolean>(checkboxKey);
	});  
}

async function initializeHttpStatus() {
	const btnEnableDisableStatus = document.querySelector(
		'[test-id=btn-enable-disable-status]'
	) as HTMLButtonElement;
	let enabled = await utils.getStorageValue(constants.EXTENSION_STATUS_KEY);
	updateEditableContainerByStatus(enabled);
	
	btnEnableDisableStatus?.addEventListener(
		'click',
		function () {
			enabled = !enabled;

			console.debug({enabled})

			showButtonStatus(
				btnEnableDisableStatus,
				utils.setStorageValue(constants.EXTENSION_STATUS_KEY, enabled)
			);
			updateConfigOnClient(constants.EXTENSION_STATUS_KEY, enabled);
			updateEditableContainerByStatus(enabled);
		},
		false
	);
}

async function showButtonStatus(
	target: HTMLButtonElement,
	promise: Promise<void>
) {
	const titleOriginal = target.innerHTML;
	target.innerHTML = '...';
	await promise;

	setTimeout(function () {
		target.innerHTML = 'Done!';
		setTimeout(function () {
			target.innerHTML = titleOriginal;
		}, 500);
	}, 300);
}

async function updateEditableContainerByStatus(enabled: boolean) {
	const containers = document.querySelectorAll<HTMLDivElement>(
		'[role="contentinfo"]'
	);
	containers.forEach(function (container) {
		container.style.opacity = enabled
			? constants.EXTENSION_STATUS_OPACITY.Enabled
			: constants.EXTENSION_STATUS_OPACITY.Disabled;
		container.style.pointerEvents = enabled
			? constants.EXTENSION_STATUS_POINTER_EVENTS.Enabled
			: constants.EXTENSION_STATUS_POINTER_EVENTS.Disabled;
	});
}