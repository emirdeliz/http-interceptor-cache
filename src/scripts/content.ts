/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as constants from './constants';

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
  } catch(err) {
    return;
  }
};

function checkIsRequestByPass(url: string, method: string) { 
  const bypassKey = `${constants.EXTENSION_NAME}-${method}` as keyof typeof extensionConfig;
	const isMethodByPass = extensionConfig[bypassKey];
	const httpInterceptorCacheRegex = extensionConfig[constants.EXTENSION_REGEX_KEY];
	const isRegexValidToApplyCache = httpInterceptorCacheRegex
		? new RegExp(httpInterceptorCacheRegex, 'g').test(url)
    : true;
  const isByPass = !isRegexValidToApplyCache || isMethodByPass;
  return isByPass;
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
  XMLHttpRequest.prototype.send = async function(body: any) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const self = this;
      // @ts-ignore
      const url = this.url as string;
      // @ts-ignore
      const method = this.method as string;

      const isExtensionEnabled = extensionConfig[constants.EXTENSION_STATUS_KEY];
      if (!isExtensionEnabled || checkIsRequestByPass(url, method)) {
        // @ts-ignore;
        send.call(this, body);
        return;
      }

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

      const cache = localStorage.getItem(url);
      if (cache !== '""') {
        self.abort();
        console.log(`Endpoint ${url} found in cache...`);
        Object.defineProperty(self, 'response', {
          value: cache,
          writable: false,
        });
        // @ts-ignore
        self.readyState = XMLHttpRequest.DONE;
        // @ts-ignore
        self.status = 200;
        // @ts-ignore
        onLoad && onLoad();
      }
    } catch(e) {
      console.log(e);
    }
  }
  console.log("[HTTPInterceptorCache: Installed]");
})(window);