(()=>{const n="http-interceptor-update-state",e="http-interceptor-get-state",t="http-interceptor-cache-extension-enabled",c="http-interceptor-cache-extension-regex",a={Disabled:"0.3",Enabled:"1"},o={Disabled:"none",Enabled:"auto"};function i(){const t=r({channel:e,callback:function(n){null!=chrome.runtime.id&&chrome.runtime.sendMessage({...n.data,channel:e},(function(t){l({channel:`${e}-${n.data.key||"ALL"}`,message:t})}))}}),c=r({channel:n,callback:function(e){null!=chrome.runtime.id&&chrome.runtime.sendMessage({...e.data,channel:n},(function(t){l({channel:`${n}-${e.data.key||"ALL"}`,message:t})}))}});window.addEventListener("beforeunload",(function(){t.close(),c.close()}))}function l({channel:n,message:e,callback:t}){const c=n instanceof BroadcastChannel,a=c?n:new BroadcastChannel(n),o=c?n.name:n,i=JSON.parse(JSON.stringify(e||{channel:""}));i.channel=o,a.postMessage(i),c||a.close(),t&&t()}function r({channel:n,callback:e}){const t=new BroadcastChannel(n);return t.onmessage=function(n){return e&&e(n)},t}async function s(n){return new Promise((function(t,c){try{!function({channel:n,message:e,callback:t}){const{key:c}=e||{},a=r({channel:`${n}-${c||"ALL"}`,callback:function(n){t&&t(n,e),a.close()}});l({channel:n,message:e})}({channel:e,message:{key:n},callback:function(e){t(e.data[n])}})}catch(n){console.warn("Error - GET cache: ",n),c("Error - GET cache")}}))}async function u(e,t){return new Promise((function(c,a){try{l({channel:n,message:{key:e,value:t},callback:c})}catch(n){console.warn("Error - SET cache: ",n),a("Error - SET cache")}}))}let d="",h=!1;async function f(n,e){const t=n.innerHTML;n.innerHTML="...",await e,setTimeout((function(){n.innerHTML="Done!",setTimeout((function(){n.innerHTML=t}),500)}),300)}function m(){document.querySelectorAll('[role="contentinfo"]').forEach((function(n){n.style.opacity=h?a.Enabled:a.Disabled,n.style.pointerEvents=h?o.Enabled:o.Disabled}))}function b(n){const e=n.parentNode?.querySelector("label"),t=e?.innerHTML;return`http-interceptor-cache-${t}`}window.addEventListener("load",(function(){i(),async function(){const n=document.querySelector("[type=text]"),e=await s(c)||"";n&&(n.value=e,d=e);n&&n.addEventListener("change",(function(n){h&&(d=n.target.value||"")}));const t=document.getElementById("btn-save-regex");t?.addEventListener("click",(function(){f(t,u(c,d))}),!1)}(),document.querySelectorAll("[type=checkbox]").forEach((function(n){!async function(n){const e=b(n);e&&(n.checked=await s(e)||!1)}(n),function(n){n.addEventListener("click",(function(e){if(!h)return;const t=b(n);t&&u(t,n.checked)}))}(n)})),async function(){h=await s(t)||!1,m(),r({channel:`${n}-${t}`,callback:function(n){h=n.data.value,m()}});const e=document.querySelector("[test-id=btn-enable-disable-status]");e?.addEventListener("click",(function(){f(e,u(t,!h))}),!1)}()}),!1)})();