var Modeste=function(){"use strict";var o="modesteRoot",p="__modesteInternal",u=window.Node.COMMENT_NODE,d=window.Node.ELEMENT_NODE,f=window.Node.TEXT_NODE;function s(t,e){return t===e}function a(t,e){return!s(t,e)}function c(t,e){return!function(t,e){var r=Object.keys(t),n=Object.keys(e);if(r.length!==n.length)return!1;for(var o=0;o<r.length;o++){var i=r[o];if(n.indexOf(i)<0)return!1;if(!s(t[i],e[i]))return!1}return!0}(t,e)}var l=["willCreate","didCreate","willMount","didMount","willUpdate","didUpdate","willRemove","didRemove","shouldUpdateData","shouldUpdateProps"];function h(t,e){t[p][e]&&t[p][e]()}var n=4,i=0;function m(t){var e=Math.random().toString(36).substr(2,n),r=e+"0".repeat(n-e.length)+(i++).toString(36);return t?t(r):r}function y(e){return m(function(t){return e+"_"+t})}function v(t,e){if(t){var r=document.createElement("style");if(e){var n="."+e;r.textContent=t.replace(/:\$/gm,n)}else r.textContent=t;return document.head.appendChild(r),r}}function b(t,n,e){var o={},i={},s={tag:t,props:o,attrs:i};return n&&(n instanceof Array?e=n:Object.keys(n).forEach(function(t){switch(t[0]){case"_":i[(e=t.substr(1),r=e.replace(/([A-Z])/g,"-$1").toLowerCase(),"-"===r[0]?r.substr(1):r)]=n[t];break;case"$":s[t.substr(1)]=n[t];break;default:o[t]=n[t]}var e,r})),s.children=e||[],s}function O(t,e){var r={},n={component:t,props:r};return e&&Object.keys(e).forEach(function(t){switch(t[0]){case"$":n[t.substr(1)]=e[t];break;default:r[t]=e[t]}}),n}function E(t,e){t&&"string"!=typeof t&&e&&(t.component||(t.props.className||(t.props.className=""),t.attrs.class||(t.attrs.class=""),t.props.className=(t.props.className+" "+e).trim(),t.attrs.class=(t.attrs.class+" "+e).trim()))}function g(t,e,r){return r[p].factories[t]?r[p].factories[t](e,r):r[p].app.factories[t](e,r)}function w(t){var e=t[p].children;Object.keys(e).forEach(function(t){return w(e[t])}),t[p].mounted=!0,h(t,"didMount")}var j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},k=function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")},e=function(){function n(t,e){for(var r=0;r<e.length;r++){var n=e[r];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(t,n.key,n)}}return function(t,e,r){return e&&n(t.prototype,e),r&&n(t,r),t}}(),r=function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function, not "+typeof e);t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,enumerable:!1,writable:!0,configurable:!0}}),e&&(Object.setPrototypeOf?Object.setPrototypeOf(t,e):t.__proto__=e)},_=function(t,e){if(!t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return!e||"object"!=typeof e&&"function"!=typeof e?t:e};function N(e,r){if(E(e,r[p].scope),!e)return document.createComment("");switch(void 0===e?"undefined":j(e)){case"string":return document.createTextNode(e);case"object":if(e.component){var t=g(e.component,e.props,r);return e.ref&&e.ref(t),S(t),t[p].dom}var n=document.createElement(e.tag);return n[p]={},n[p].attrs={},n[p].props={},Object.keys(e.attrs).forEach(function(t){null!==e.attrs[t]&&(n.setAttribute(t,e.attrs[t]),n[p].attrs[t]=e.attrs[t])}),Object.keys(e.props).forEach(function(t){null!==e.props[t]&&(n[t]=e.props[t],n[p].props[t]=e.props[t])}),e.children.forEach(function(t){var e=N(t,r);n.appendChild(e),r[p].mounted&&e[p]&&e[p].id&&w(r[p].children[e[p].id])}),e.ref&&e.ref(n),n}}function C(t,e,r){if(t[p]&&t[p].id){var n=t[p].id,o=r[p].children[n];if(e.props||(e.props={}),o[p].name===e.component)return o[p].dom=t,i=o,s=e.props,i[p].shouldUpdateProps(i.props,s)&&(i[p].props=s,S(i)),void(e.ref&&e.ref(o));r[p].removeChild(n)}var i,s,a=g(e.component,e.props,r);a[p].dom=t,e.ref&&e.ref(a),S(a),r[p].mounted&&w(a)}function T(n,r,o){if(E(r,o[p].scope),r&&r.component)C(n,r,o);else{if(e=n,!((i=r)?"object"===(void 0===i?"undefined":j(i))&&e.nodeType===d?i.tag.toUpperCase()===e.tagName:"string"==typeof i&&e.nodeType===f:e.nodeType===u)){n[p]&&n[p].id&&function e(t,r){if(t[p].children[r]){var n=t[p].children[r];h(n,"willRemove"),delete n[p].dom,Object.keys(n[p].children).forEach(function(t){e(t,n)}),h(n,"didRemove"),delete t[p].children[r]}}(o,n[p].id);var t=N(r,o);return n.parentNode.replaceChild(t,n),void(o[p].dom===n&&(o[p].dom=t))}var e,i;switch(n.nodeType){case d:var s=[];n[p].attrs&&Object.keys(n[p].attrs).forEach(function(t){s.push(t)}),n[p].attrs||(n[p].attrs={}),Object.keys(r.attrs).forEach(function(t){null===r.attrs[t]?(n.removeAttribute(t),delete n[p].attrs[t]):n[p].attrs[t]!==r.attrs[t]&&(n.setAttribute(t,r.attrs[t]),n[p].attrs[t]=r.attrs[t]);var e=s.indexOf(t);-1<e&&s.splice(e,1)}),s.forEach(function(t){n.removeAttribute(t),delete n[p].attrs[t]});var a=[];for(n[p].props&&Object.keys(n[p].props).forEach(function(t){a.push(t)}),n[p].props||(n[p].props={}),Object.keys(r.props).forEach(function(t){null===r.props[t]?(n[t]=null,delete n[p].props[t]):n[p].props[t]!==r.props[t]&&(n[t]=r.props[t],n[p].props[t]=r.props[t]);var e=a.indexOf(t);-1<e&&a.splice(e,1)}),a.forEach(function(t){n[t]=null,delete n[p].props[t]}),r.children||(r.children=[]),r.children.forEach(function(t,e){if(n.childNodes[e])T(n.childNodes[e],t,o);else{var r=N(t,o);n.appendChild(r),o[p].mounted&&r[p]&&r[p].id&&w(o[p].children[r[p].id])}});n.childNodes[r.children.length];){var c=n.childNodes[r.children.length];n.removeChild(c)}r.ref&&r.ref(n);break;case f:n.nodeValue!==r&&(n.nodeValue=r)}}}var P=function(t){function i(){var t;k(this,i);for(var e=arguments.length,r=Array(e),n=0;n<e;n++)r[n]=arguments[n];var o=_(this,(t=i.__proto__||Object.getPrototypeOf(i)).call.apply(t,[this].concat(r)));return o.name="MODESTE Error",o.message="[MODESTE ERROR] "+o.message,Error.captureStackTrace(o,modesteError),o}return r(i,t),i}(Error);function S(t){var e=!t[p].dom;h(t,e?"willMount":"willUpdate");var r=t[p].render(b,O);if("object"!==(void 0===r?"undefined":j(r))||r.component||!r.tag)throw new P(t[p].name+": Component root must be a tag");e?t[p].dom=N(r,t):T(t[p].dom,r,t),t[p].dom[p].id=t[p].id,e||h(t,"didUpdate")}var M=function(){function i(e,t){var r,n,o=this;k(this,i),this[p]={},e.manifest.factories||(e.manifest.factories={}),this[p].factories=e.manifest.factories,this[p].parent=t,this[p].app=t?t[p].app:this,this[p].name=e.name,this[p].id=e.id,this[p].scope=e.scope,this[p].children={},this[p].props=e.props?e.props:{},this[p].render=e.manifest.render.bind(this),this[p].shouldUpdateData=a,this[p].shouldUpdateProps=c,r=this,n=e.manifest,l.forEach(function(t){n[t]&&(r[p][t]=n[t].bind(r))}),h(this,"willCreate"),e.manifest.data&&(this[p].data=e.manifest.data(),Object.keys(this[p].data).forEach(function(e){return Object.defineProperty(o,e,{enumerable:!0,get:function(){return this[p].data[e]},set:function(t){this[p].shouldUpdateData(this[p].data[e],t)&&(this[p].data[e]=t,S(this))}})})),e.manifest.components&&Object.keys(e.manifest.components).forEach(function(t){!function(t,o,i){if(!t[p].factories[o]){var s=!1!==i.scope&&y(o);v(i.style(),s),t[p].factories[o]=function(t,e){var r=m(),n=new M({name:o,manifest:i,scope:s,id:r,props:t},e);return e[p].children[r]=n}}}(o,t,e.manifest.components[t])}),e.manifest.methods&&Object.keys(e.manifest.methods).forEach(function(t){o[t]=e.manifest.methods[t].bind(o)}),h(this,"didCreate")}return e(i,[{key:"render",value:function(){S(this)}},{key:"props",get:function(){return this[p].props}},{key:"$app",get:function(){return this[p].app}}]),i}(),U=y(o);return function(t){function n(t,e){k(this,n);var r=_(this,(n.__proto__||Object.getPrototypeOf(n)).call(this,{name:o,id:o,manifest:t,props:e,scope:U}));return t.style&&v(t.style(),U),r[p].wrap=t.selector?document.querySelector(t.selector):null,r}return r(n,M),e(n,[{key:"render",value:function(){if(function t(e,r,n){null===e&&(e=Function.prototype);var o=Object.getOwnPropertyDescriptor(e,r);if(void 0===o){var i=Object.getPrototypeOf(e);return null===i?void 0:t(i,r,n)}if("value"in o)return o.value;var s=o.get;return void 0!==s?s.call(n):void 0}(n.prototype.__proto__||Object.getPrototypeOf(n.prototype),"render",this).call(this),!this[p].mounted&&!this[p].wrap)return w(this);this[p].wrap&&0===this[p].wrap.childNodes.length&&(this[p].wrap.appendChild(this[p].dom),w(this))}},{key:"$dom",get:function(){return this[p].dom}}]),n}()}();
//# sourceMappingURL=modeste.browser.js.map
