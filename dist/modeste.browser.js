var Modeste=function(){"use strict";var o="modesteRoot",u="__modesteInternal",d=window.Node.COMMENT_NODE,f=window.Node.ELEMENT_NODE,l=window.Node.TEXT_NODE;function s(t,e){return t===e}function a(t,e){return!s(t,e)}function c(t,e){return!function(t,e){var r=Object.keys(t),n=Object.keys(e);if(r.length!==n.length)return!1;for(var o=0;o<r.length;o++){var i=r[o];if(n.indexOf(i)<0)return!1;if(!s(t[i],e[i]))return!1}return!0}(t,e)}var p=["willCreate","didCreate","willMount","didMount","willUpdate","didUpdate","willRemove","didRemove","shouldUpdateData","shouldUpdateProps"];function h(t,e){t[u][e]&&t[u][e]()}var n=6,i=0;function m(t){var e=Math.random().toString(36).substr(2,n),r=e+"0".repeat(n-e.length)+(i++).toString(36);return t?t(r):r}function y(e){return m(function(t){return e+"_"+t})}function v(t,e){if(t){var r=document.createElement("style");if(e){var n="."+e;r.textContent=t.replace(/:\$/gm,n)}else r.textContent=t;return document.head.appendChild(r),r}}function b(t,n,e){var o={},i={},s={tag:t,props:o,attrs:i};return n&&(n instanceof Array?e=n:Object.keys(n).forEach(function(t){switch(t[0]){case"_":i[(e=t.substr(1),r=e.replace(/([A-Z])/g,"-$1").toLowerCase(),"-"===r[0]?r.substr(1):r)]=n[t];break;case"$":s[t.substr(1)]=n[t];break;default:o[t]=n[t]}var e,r})),s.children=e||[],s}function w(t,e){var r={},n={component:t,props:r};return e&&Object.keys(e).forEach(function(t){switch(t[0]){case"$":n[t.substr(1)]=e[t];break;default:r[t]=e[t]}}),n}function E(t,e){t&&"string"!=typeof t&&e&&(t.component||(t.props.className||(t.props.className=""),t.attrs.class||(t.attrs.class=""),t.props.className=(t.props.className+" "+e).trim(),t.attrs.class=(t.attrs.class+" "+e).trim()))}function O(t,e,r){return r[u].factories[t]?r[u].factories[t](e,r):r[u].app.factories[t](e,r)}function g(t){var e=t[u].children;Object.keys(e).forEach(function(t){return g(e[t])}),t[u].mounted=!0,h(t,"didMount")}var k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},j=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},e=function(){function n(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}}(),r=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},_=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e};function C(e,r){if(E(e,r[u].scope),!e)return document.createComment("");switch(void 0===e?"undefined":k(e)){case"string":return document.createTextNode(e);case"object":if(e.component){var t=O(e.component,e.props,r);return e.ref&&e.ref(t),$(t),t[u].dom}var n=document.createElement(e.tag);return n[u]={},n[u].attrs={},n[u].props={},Object.keys(e.attrs).forEach(function(t){null!==e.attrs[t]&&(n.setAttribute(t,e.attrs[t]),n[u].attrs[t]=e.attrs[t])}),Object.keys(e.props).forEach(function(t){null!==e.props[t]&&(n[t]=e.props[t],n[u].props[t]=e.props[t])}),e.children.forEach(function(t){var e=C(t,r);n.appendChild(e),r[u].mounted&&e[u]&&e[u].id&&g(r[u].children[e[u].id])}),e.ref&&e.ref(n),n}}function N(t,e){t[u].shouldUpdateProps(t.props,e)&&(t[u].props=e,$(t))}function T(n,r,o){if(E(r,o[u].scope),r&&r.component)!function(t,e,r){if(t[u]&&t[u].id){var n=t[u].id,o=r[u].children[n];if(e.props||(e.props={}),o[u].name===e.component)return o[u].dom=t,N(o,e.props),e.ref&&e.ref(o);r[u].removeChild(n)}var i=O(e.component,e.props,r);i[u].dom=t,e.ref&&e.ref(i),$(i),r[u].mounted&&g(i)}(n,r,o);else{if(e=n,!((i=r)?"object"===(void 0===i?"undefined":k(i))&&e.nodeType===f?i.tag.toUpperCase()===e.tagName:"string"==typeof i&&e.nodeType===l:e.nodeType===d)){n[u]&&n[u].id&&function e(t,r){if(t[u].children[r]){var n=t[u].children[r];h(n,"willRemove"),delete n[u].dom,Object.keys(n[u].children).forEach(function(t){e(t,n)}),h(n,"didRemove"),delete t[u].children[r]}}(o,n[u].id);var t=C(r,o);return n.parentNode.replaceChild(t,n),void(o[u].dom===n&&(o[u].dom=t))}var e,i;switch(n.nodeType){case f:var s=[];n[u].attrs&&Object.keys(n[u].attrs).forEach(function(t){s.push(t)}),n[u].attrs||(n[u].attrs={}),Object.keys(r.attrs).forEach(function(t){null===r.attrs[t]?(n.removeAttribute(t),delete n[u].attrs[t]):n[u].attrs[t]!==r.attrs[t]&&(n.setAttribute(t,r.attrs[t]),n[u].attrs[t]=r.attrs[t]);var e=s.indexOf(t);-1<e&&s.splice(e,1)}),s.forEach(function(t){n.removeAttribute(t),delete n[u].attrs[t]});var a=[];if(n[u].props&&Object.keys(n[u].props).forEach(function(t){a.push(t)}),n[u].props||(n[u].props={}),Object.keys(r.props).forEach(function(t){null===r.props[t]?(n[t]=null,delete n[u].props[t]):n[u].props[t]!==r.props[t]&&(n[t]=r.props[t],n[u].props[t]=r.props[t]);var e=a.indexOf(t);-1<e&&a.splice(e,1)}),a.forEach(function(t){n[t]=null,delete n[u].props[t]}),r.children[0]&&r.children[0].key){var c={};n.childNodes.forEach(function(t){c[t[u].key]=t,n.removeChild(t)}),r.children.forEach(function(t){c[t.key]?n.appendChild(t):n.appendChild(C(t))})}else for(r.children.forEach(function(t,e){if(n.childNodes[e])T(n.childNodes[e],t,o);else{var r=C(t,o);n.appendChild(r),o[u].mounted&&r[u]&&r[u].id&&g(o[u].children[r[u].id])}});n.childNodes[r.children.length];){var p=n.childNodes[r.children.length];n.removeChild(p)}r.ref&&r.ref(n);break;case l:n.nodeValue!==r&&(n.nodeValue=r)}}}var P=function(t){function i(){var t;j(this,i);for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];var o=_(this,(t=i.__proto__||Object.getPrototypeOf(i)).call.apply(t,[this].concat(r)));return o.name="MODESTE Error",o.message="[MODESTE ERROR] "+o.message,Error.captureStackTrace(o,modesteError),o}return r(i,t),i}(Error);function $(t){var e=!t[u].dom;h(t,e?"willMount":"willUpdate");var r=t[u].render(b,w,t[u].props);if("object"!==(void 0===r?"undefined":k(r))||r.component||!r.tag)throw new P(t[u].name+": Component root must be a tag");e?t[u].dom=C(r,t):T(t[u].dom,r,t),t[u].dom[u].id=t[u].id,e||h(t,"didUpdate")}var t=void 0,S=void 0;window.setImmediate?t=window.setImmediate:window.Promise?(S=Promise.resolve(),t=function(t){S.then(t)}):t=function(t){setTimeout(t,0)};var M=t,U={},A=!0;function D(t,e){U[t[u].id]||(U[t[u].id]=t),A&&(A=!1,M(function(){Object.keys(U).forEach(function(t){(U[t][u].isApp||U[t][u].parent.mounted)&&$(U[t])}),U={},A=!0,e&&e()}))}var R=function(){function i(e,t){var r,n,o=this;j(this,i),this[u]={},e.manifest.factories||(e.manifest.factories={}),this[u].factories=e.manifest.factories,this[u].parent=t,this[u].app=t?t[u].app:this,this[u].name=e.name,this[u].id=e.id,this[u].scope=e.scope,this[u].children={},this[u].props=e.props?e.props:{},this[u].render=e.manifest.render.bind(this),this[u].shouldUpdateData=a,this[u].shouldUpdateProps=c,r=this,n=e.manifest,p.forEach(function(t){n[t]&&(r[u][t]=n[t].bind(r))}),h(this,"willCreate"),e.manifest.data&&(this[u].data=e.manifest.data(),Object.keys(this[u].data).forEach(function(e){return Object.defineProperty(o,e,{enumerable:!0,get:function(){return this[u].data[e]},set:function(t){this[u].shouldUpdateData(this[u].data[e],t)&&(this[u].data[e]=t,D(this))}})})),e.manifest.components&&Object.keys(e.manifest.components).forEach(function(t){!function(t,o,i){if(!t[u].factories[o]){var s=!1!==i.scope&&y(o);v(i.style(),s),t[u].factories[o]=function(t,e){var r=m(),n=new R({name:o,manifest:i,scope:s,id:r,props:t},e);return e[u].children[r]=n}}}(o,t,e.manifest.components[t])}),e.manifest.methods&&Object.keys(e.manifest.methods).forEach(function(t){o[t]=e.manifest.methods[t].bind(o)}),h(this,"didCreate")}return e(i,[{key:"$render",value:function(){$(this)}},{key:"$data",get:function(){return this[u].data}},{key:"$props",get:function(){return this[u].props}},{key:"$app",get:function(){return this[u].app}},{key:"$dom",get:function(){return this[u].dom}}]),i}(),x=y(o);return function(t){function n(t,e){j(this,n);var r=_(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,{name:o,id:o,manifest:t,props:e,scope:x}));return r[u].parent=null,r[u].isApp=!0,t.style&&v(t.style(),x),r[u].wrap=t.selector?document.querySelector(t.selector):null,r.$render(),r}return r(n,R),e(n,[{key:"$render",value:function(){if(function t(e,r,n){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,r);if(void 0===o){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,r,n)}if("value"in o)return o.value;var s=o.get;return void 0!==s?s.call(n):void 0}(n.prototype.__proto__||Object.getPrototypeOf(n.prototype),"$render",this).call(this),!this[u].mounted&&!this[u].wrap)return g(this);this[u].wrap&&0===this[u].wrap.childNodes.length&&(this[u].wrap.appendChild(this[u].dom),g(this))}},{key:"$wrap",get:function(){return this[u].wrap}},{key:"$props",set:function(t){N(this,t)}}]),n}()}();
//# sourceMappingURL=modeste.browser.js.map
