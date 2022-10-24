import {
	MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY,
	MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY,
} from './constants';
import { updateExtensionState } from './utils';

let regexValue = '';
let enabled = false;

// document.addEventListener(
// 	'DOMContentLoaded',
// 	() => {
// 		initializeHttpInputRegex();
// 		initializeHttpCheckbox();
// 		initializeHttpStatus();
// 	},
// 	false
// );

window.onload = function () {
	setTimeout(() => {
		initializeHttpInputRegex();
		initializeHttpCheckbox();
		initializeHttpStatus();
	}, 2000);
};

function initializeHttpStatus() {
	updateEditableContainerByStatus();

	const btnSaveStatus = document.getElementById('btn-save-status');
	btnSaveStatus?.addEventListener(
		'click',
		function () {
			const messageKey = MESSAGE_UPDATE_EXTENSION_IS_ENABLED_KEY;
			chrome.runtime.sendMessage({ messageKey, value: enabled }, function () {
				updateEditableContainerByStatus();
			});
		},
		false
	);
}

function updateEditableContainerByStatus() {
	const messageKey = MESSAGE_CHECK_IF_EXTENSION_IS_ENABLED_KEY;
	chrome.runtime.sendMessage({ messageKey, value: enabled }, function (result) {
		enabled = !result;
		const containers = document.querySelectorAll<HTMLDivElement>('.grid-editable');
		containers.forEach(function (container) {
			container.style.opacity = enabled ? '1' : '0.3';
			container.style.pointerEvents = enabled ? 'auto' : 'none';
		});
	});
}

function initializeHttpInputRegex() {
	const inputHttp = document.querySelector<HTMLInputElement>('[type=text]');
	getExtensionState('regex', function (value: string) {
		if (inputHttp) {
			inputHttp.value = value;
			regexValue = value;
		}
	});

	inputHttp &&
		inputHttp.addEventListener('change', function (e) {
			if (!enabled) {
				return;
			}
			regexValue = (e.target as HTMLInputElement).value || '';
		});

	const btnSaveRegex = document.getElementById('btn-save-regex');
	btnSaveRegex?.addEventListener(
		'click',
		function () {
			updateExtensionState('regex', regexValue, function () {});
		},
		false
	);
}

function initializeHttpCheckbox() {
	const checkboxHttp =
		document.querySelectorAll<HTMLInputElement>('[type=checkbox]');

	checkboxHttp.forEach(function (cbx) {
		checkboxSetState(cbx);
		checkboxAddEventListener(cbx);
	});
}

function checkboxSetState(cbx: HTMLInputElement) {
	const checkboxKey = getCheckboxKey(cbx);
	checkboxKey &&
		getExtensionState(checkboxKey, function (value: boolean) {
			cbx.checked = value;
		});
}

function getCheckboxKey(cbx: HTMLInputElement) {
	const checkboxLabel =
		cbx.parentNode?.querySelector<HTMLLabelElement>('label');
	const checkboxKey = checkboxLabel?.innerHTML;
	return checkboxKey;
}

function checkboxAddEventListener(cbx: HTMLInputElement) {
	cbx.addEventListener('click', function (e) {
		if (!enabled) {
			return;
		}
		const checkboxKey = getCheckboxKey(cbx);
		checkboxKey && updateExtensionState(checkboxKey, cbx.checked, function () {});
	});
}
