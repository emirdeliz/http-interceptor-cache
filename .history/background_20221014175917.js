 function makeProxy() {
	const oldXHROpen = window.XMLHttpRequest.prototype.open;
	window.XMLHttpRequest.prototype.open = function () {
		this.addEventListener('load', function () {
			// return new Promise(function (resolve) {
			// 	chrome.runtime.sendMessage(
			// 		{ messageId: 'http-interceptor-cache-request' },
			// 		function (response) {
			// 			resolve(response);
			// 		}
			// 	);
			// });
		});
		return oldXHROpen.apply(this, arguments);
	};
}
makeProxy();