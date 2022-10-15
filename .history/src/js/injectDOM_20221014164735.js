const originXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	this.addEventListener('load', function () {
		return new Promise(function (resolve) {
			
		});
	});
	return originXHROpen.apply(this, arguments);
}
