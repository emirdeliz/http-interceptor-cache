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

const trySerializableObject = (object: any) => {
  try {
    const objSerializable = JSON.stringify(object);
    JSON.parse(objSerializable);
    return objSerializable;
  } catch (err) {
    console.log(" JSON has failed to preserve Date during stringify/parse ");
    console.log("  and has generated the following error message", err.message);
  }
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

      const onLoad = self.onload;
      self.onload = function(e) {
        const { response } = self;
        const responseSerializable = trySerializableObject(response);
        if (responseSerializable) {
          console.log(`Endpoint ${url} put in cache...`, response);
          localStorage.setItem(url, responseSerializable);
        }
        onLoad?.call(this, e);
      }

      const cache = getCacheFromLocalStorage(url, method);
      console.log({cache, url, method});

      if (cache) {
        console.log(`Endpoint ${url} found in cache...`);
        Object.defineProperty(self, 'response', {
          value: JSON.parse(cache),
          writable: false,
        });
        // @ts-ignore
        self.readyState = XMLHttpRequest.DONE;
        // @ts-ignore
        self.status = 200;
        // @ts-ignore
        onLoad && onLoad();
        self.abort();
      } else {
        // @ts-ignore;
        send.call(this, arguments);
      }
    } catch(e) {
      console.log(e);
    }
  }
  console.log("[HTTPInterceptorCache: Installed]");
})(window);