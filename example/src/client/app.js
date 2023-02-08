function makeXMLHttpRequest(method, body) { 
	const client = new XMLHttpRequest();
	client.onload = function() { 
		console.log(client.response); 
	};
	client.open(method, `${method}-data`);
	client.setRequestHeader('Content-Type', 'application/json; charset=utf-8');
	client.send(body);
}

function buildRandomFormData() { 
	const data = new FormData();
	data.append('id', getRandomInt(1000, 100000000), );
	data.append('user', generateName(), );
	data.append('pwd', '123');
	data.append('organization', generateName());
}

function makePost() { 
	const formData = buildRandomFormData();
	makeXMLHttpRequest('post', formData);
}

function makeGet() { 
	const params = { id: getRandomInt(1000, 100000000) };
	makeXMLHttpRequest('get', params);
}

function makePut() { 
	const formData = buildRandomFormData();
	makeXMLHttpRequest('put', formData);
}

function makeDelete() { 
	const params = { id: getRandomInt(1000, 100000000) };
	makeXMLHttpRequest('delete', params);
}

function makePatch() { 
	const params = { user: generateName() };
	makeXMLHttpRequest('patch', params);
}