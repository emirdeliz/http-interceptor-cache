const oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	this.addEventListener('load', function () {
		return new Promise(function (resolve) {
			chrome.runtime.connect('gbnjnikpmojonmejodjfemmbcmkcjkmi').sendMessage({ messageId: 'http-interceptor-cache-request' }, function (response) {
				console.log({ response })
				resolve(response);
			});
		});
	});
	return oldXHROpen.apply(this, arguments);
}
