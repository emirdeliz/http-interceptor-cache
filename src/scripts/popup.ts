import {
	EXTENSION_REGEX_KEY,
	EXTENSION_STATUS_KEY,
	MESSAGE_UPDATE_STATE_KEY,
} from './constants';
import {
	getFromCache,
	initializeBroadcastChannelCache,
	initializeBroadcastMessageCacheResponse,
	putInCache,
	sendBroadcastMessageCache,
} from './utils';

let regexValue = '';
let enabled = false;

window.addEventListener(
	'load',
	function () {
		initializeBroadcastChannelCache();
		// initializeHttpInputRegex();
		// initializeHttpCheckbox();
		initializeHttpStatus();
	},
	false
);

// const onloadOriginal = window.onload;
// window.onload = function (e) {
// 	initializeBroadcastChannelCache();
// 	// initializeHttpInputRegex();
// 	// initializeHttpCheckbox();
// 	initializeHttpStatus();
// };

async function initializeHttpStatus() {
	enabled = (await getFromCache<boolean>(EXTENSION_STATUS_KEY)) || false;
	updateEditableContainerByStatus();

	console.log({
		enabled,
	});

	initializeBroadcastMessageCacheResponse({
		channel: `${MESSAGE_UPDATE_STATE_KEY}-${EXTENSION_STATUS_KEY}`,
		callback: function (e: MessageEvent) {
			enabled = e.data.value;
				console.log({
					enabled,
				});
			updateEditableContainerByStatus();
		},
	});

	const btnSaveStatus = document.getElementById('btn-save-status');
	btnSaveStatus?.addEventListener(
		'click',
		function () {
			putInCache(EXTENSION_STATUS_KEY, !enabled);
		},
		false
	);
}

function updateEditableContainerByStatus() {
	const containers =
		document.querySelectorAll<HTMLDivElement>('.grid-editable');
	containers.forEach(function (container) {
		container.style.opacity = enabled ? '1' : '0.3';
		container.style.pointerEvents = enabled ? 'auto' : 'none';
	});
}

async function initializeHttpInputRegex() {
	const inputHttp = document.querySelector<HTMLInputElement>('[type=text]');
	const regex = (await getFromCache<string>(EXTENSION_REGEX_KEY)) || '';

	if (inputHttp) {
		inputHttp.value = regex;
		regexValue = regex;
	}

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
			putInCache(EXTENSION_REGEX_KEY, regexValue);
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

async function checkboxSetState(cbx: HTMLInputElement) {
	const checkboxKey = getCheckboxKey(cbx);
	if (checkboxKey) {
		cbx.checked = (await getFromCache<boolean>(checkboxKey)) || false;
	}
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
		if (checkboxKey) {
			putInCache(checkboxKey, cbx.checked);
		}
	});
}
