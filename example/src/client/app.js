function clearLocalStorage() { 
	console.log('Clear local storage...');
	localStorage.clear();
}

function makeXMLHttpRequest(method, { formData, query }) { 
	const client = new XMLHttpRequest();
	client.open(method.toUpperCase(), `${method}-data${query ? `/${query}` : ''}`, true);
	client.setRequestHeader('Content-Type', `application/${formData ? 'json' : 'text'}; charset=utf-8`);
	client.send(formData ? JSON.stringify(formData) : null);
	client.onload = function() {
		console.log(client.response);
	};
}

function buildRandomFormData() { 
	return {
		id: getRandomInt(1000, 100000000),
		name: generateName(),
		password: getRandomInt(1000, 100000000)
	}
}

function makePost() { 
	const formData = buildRandomFormData();
	makeXMLHttpRequest('post', { formData });
}

function makePut() { 
	const formData = buildRandomFormData();
	makeXMLHttpRequest('put', { formData });
}

function makeGet() { 
	const query = getRandomInt(1000, 100000000);
	makeXMLHttpRequest('get', { query });
}

function makeDelete() { 
	const query = getRandomInt(1000, 100000000);
	makeXMLHttpRequest('delete', { query });
}

function makePatch() { 
	const query = generateName();
	makeXMLHttpRequest('patch', { query });
}