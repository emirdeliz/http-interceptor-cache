console.log('--- initializeHttpCache');
console.log(window.XMLHttpRequest.prototype);
const oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	console.log('PROTOTYPE');
	this.addEventListener('load', function () {
		return new Promise(function (resolve) {
			console.log('HERE Promise');
			chrome.runtime.sendMessage({ messageId: 'http-interceptor-cache-request' }, function (response) {
				resolve(response);
			});
		});
	});
	return oldXHROpen.apply(this, arguments);
}
