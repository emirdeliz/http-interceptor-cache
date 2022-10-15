(function(XHR) {
	const XHR = XMLHttpRequest.prototype;
	const open = XHR.open;
	const send = XHR.send;
	const setRequestHeader = XHR.setRequestHeader;

	// Collect data:
	XHR.open = function (method, url) {
		this._method = method;
		this._url = url;
		this._requestHeaders = {};
		this._startTime = new Date().toISOString();
		return open.apply(this, arguments);
	};

	XHR.setRequestHeader = function (header, value) {
		this._requestHeaders[header] = value;
		return setRequestHeader.apply(this, arguments);
	};

	XHR.send = function (postData) {
		this.addEventListener('load', function () {
			console.log({
				postData,
			});
		});
		return send.apply(this, arguments);
	};

	const undoPatch = function () {
		XHR.open = open;
		XHR.send = send;
		XHR.setRequestHeader = setRequestHeader;
	};

	return undoPatch;
})(XMLHttpRequest);