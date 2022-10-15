const oldXHROpen = window.XMLHttpRequest.prototype.open;
window.XMLHttpRequest.prototype.open = function () {
	this.addEventListener('load', function () {
		return new Promise(function (resolve) {
			
		});
	});
	return oldXHROpen.apply(this, arguments);
}
