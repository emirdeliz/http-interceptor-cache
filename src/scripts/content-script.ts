import { makeFetch } from './utils';

window.fetch = new Proxy(window.fetch, {
	apply(fetch, _that, args) {
		return new Promise<Response>(async (resolve) => {
			const result = makeFetch(fetch, args[0], args[1]);
			resolve(result);
		});
	}
});