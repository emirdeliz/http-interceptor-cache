setTimeout(async function() {
	for(const r of ['json', 'info.txt']) {
		const client = new XMLHttpRequest();
		client.onload = () => {
			console.log(client.response) 
		};
		client.open("GET", r);
		client.setRequestHeader("Content-Type", "application/json; charset=utf-8");
		client.send();

		// (function(xhr){
		// 	xhr.open('GET', r, true);
		// 	xhr.send();
		// 	xhr.onload = () => {
		// 		console.log(xhr.response) 
		// 	};
		// })(new XMLHttpRequest)
		// const res = await fetch(`/${r}`);
		// console.log({res: await res.text()});
	}
}, 1000);