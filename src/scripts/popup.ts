import {
	EXTENSION_NAME,
	EXTENSION_REGEX_KEY,
	EXTENSION_STATUS_KEY,
	EXTENSION_STATUS_OPACITY,
	EXTENSION_STATUS_POINTER_EVENTS,
	MESSAGE_UPDATE_STATE_KEY,
} from '@scripts/constants';
import {
	getFromCache,
	initializeBroadcastChannelCache,
	initializeBroadcastMessageCacheResponse,
	putInCache,
} from '@scripts/utils';

let regexValue = '';
let enabled = false;

window.addEventListener(
	'load',
	function () {
		initializeBroadcastChannelCache();
		initializeHttpInputRegex();
		initializeHttpCheckbox();
		initializeHttpStatus();
	},
	false
);

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

async function initializeHttpStatus() {
	enabled = (await getFromCache<boolean>(EXTENSION_STATUS_KEY)) || false;
	updateEditableContainerByStatus();

	initializeBroadcastMessageCacheResponse({
		channel: `${MESSAGE_UPDATE_STATE_KEY}-${EXTENSION_STATUS_KEY}`,
		callback: function (e: MessageEvent) {
			enabled = e.data.value;
			updateEditableContainerByStatus();
		},
	});

	const btnEnableDisableStatus = document.querySelector(
		'[test-id=btn-enable-disable-status]'
	) as HTMLButtonElement;
	btnEnableDisableStatus?.addEventListener(
		'click',
		function () {
			showButtonStatus(
				btnEnableDisableStatus,
				putInCache(EXTENSION_STATUS_KEY, !enabled)
			);
		},
		false
	);
}

function updateEditableContainerByStatus() {
	const containers = document.querySelectorAll<HTMLDivElement>(
		'[role="contentinfo"]'
	);
	containers.forEach(function (container) {
		container.style.opacity = enabled
			? EXTENSION_STATUS_OPACITY.Enabled
			: EXTENSION_STATUS_OPACITY.Disabled;
		container.style.pointerEvents = enabled
			? EXTENSION_STATUS_POINTER_EVENTS.Enabled
			: EXTENSION_STATUS_POINTER_EVENTS.Disabled;
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

	const btnSaveRegex = document.getElementById(
		'btn-save-regex'
	) as HTMLButtonElement;
	btnSaveRegex?.addEventListener(
		'click',
		function () {
			showButtonStatus(
				btnSaveRegex,
				putInCache(EXTENSION_REGEX_KEY, regexValue)
			);
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
	return `${EXTENSION_NAME}-${checkboxKey}`;
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
