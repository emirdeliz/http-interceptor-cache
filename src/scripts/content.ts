import * as constants from './constants';
import * as utils from '@scripts/utils';

let extensionConfig = {} as any;

const broadcastUpdate = new BroadcastChannel(constants.MESSAGE_UPDATE_STATE_KEY);
broadcastUpdate.onmessage = function (e) {
  extensionConfig = {
    ...extensionConfig,
    ...e.data,
  };
};

function getCacheFromLocalStorage(url: string, method: string) { 
  const bypassKey = `${constants.EXTENSION_NAME}-${method}` as keyof typeof extensionConfig;
	const isExtensionEnabled = extensionConfig[constants.EXTENSION_STATUS_KEY];
	const isMethodByPass = extensionConfig[bypassKey];
	const httpInterceptorCacheRegex = extensionConfig[constants.EXTENSION_REGEX_KEY];
	const isRegexValidToApplyCache = httpInterceptorCacheRegex
		? new RegExp(httpInterceptorCacheRegex, 'g').test(url)
		: true;
	const isUseCache = isExtensionEnabled && isRegexValidToApplyCache && !isMethodByPass;
  return isUseCache ? localStorage.getItem(url) : undefined;
}

(function(w){
  //Save a handle to original functions
  const open = w.XMLHttpRequest.prototype.open;
  const send = w.XMLHttpRequest.prototype.send;
  
  //Monkey patch open
  XMLHttpRequest.prototype.open = function() {
    const method = arguments[0];
    const url = arguments[1];
    // @ts-ignore;
    this.url = url;
     // @ts-ignore;
    this.method = method;
    
    // @ts-ignore;
    open.apply(this, [method, url]);
  }
  
  //Monkey patch send
  XMLHttpRequest.prototype.send = async function() {
    try {
      const self = this;
      // @ts-ignore
      const url = this.url as string;
      // @ts-ignore
      const method = this.method as string;
      const cache = getCacheFromLocalStorage(url, method);
      // await utils.getStorageValue<Response>(url);
      if (cache) {
        self.abort();
        console.log(`Endpoint ${url} found in cache...`);
        Object.defineProperty(self, 'response', {
          value: { xpto: 'Cacheeeeeee' },
          writable: false,
        });
        // @ts-ignore
        self.readyState = XMLHttpRequest.DONE;
        // @ts-ignore
        self.status = 200;
        // @ts-ignore
        self.onload && self.onload({} as any);
      }

      const onLoad = self.onload;
      self.onload = function(e) {
        const cache = localStorage.setItem(url, self.response);
        onLoad?.call(this, e);
      }
      // @ts-ignore;
      send.call(this, arguments);
    } catch(e) {
      console.log(e);
    }
  }
  console.log("[HTTPInterceptorCache: Installed]");
})(window);