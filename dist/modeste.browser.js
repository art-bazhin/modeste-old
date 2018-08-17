var Modeste=function(){"use strict";var e="modesteRoot",d="__modesteInternal";function a(t,e){return t===e}function s(t,e){return!a(t,e)}function i(t,e){!function(t,e){var r=Object.keys(t),o=Object.keys(e);if(r.length!==o.length)return;for(var n=0;n<r.length;n++){var s=r[n];if(o.indexOf(s)<0)return;if(!a(t[s],e[s]))return}}(t,e)}var c=["willCreate","didCreate","willMount","didMount","willUpdate","didUpdate","willRemove","didRemove","shouldUpdateData","shouldUpdateProps"];function p(t,e){t[d][e]&&t[d][e]()}function f(t,e,r){for(var o=void 0;o=(Math.random()*t).toFixed(0),r&&(o=r(o)),e[o];);return e[o]=!0,o}var t={};function u(e){return f(1e6,t,function(t){return e+t})}function l(t,e){if(t){var r=document.createElement("style"),o="."+e;return r.textContent=t.replace(/:\$/gm,o),document.head.appendChild(r),r}}function o(t,e,r){var o={},n={},s={tag:t,props:o,attrs:n,children:r};return e&&Object.keys(e).forEach(function(t){switch(t[0]){case"_":n[t.substr(1)]=e[t];break;case"$":s[t.substr(1)]=e[t];break;default:o[t]=e[t]}}),s}function n(t,e){var r={},o={component:t,props:r};return e&&Object.keys(e).forEach(function(t){switch(t[0]){case"$":o[t.substr(1)]=e[t];break;default:r[t]=e[t]}}),o}function h(r,t){if(r&&"string"!=typeof r&&(r.children||(r.children=[]),r.props||(r.props={}),!r.component)){if(r.attrs){var o={};Object.keys(r.attrs).forEach(function(t){var e;o[(e=t,e.replace(/([A-Z])/g,"-$1").toLowerCase())]=r.attrs[t]}),r.attrs=o}else r.attrs={};r.props.className?(delete r.attrs.class,r.props.className=t+" "+r.props.className):r.attrs.class?r.attrs.class=t+" "+r.attrs.class:r.props.className=t}}function m(t,e,r){return r[d].factories[t]?r[d].factories[t](e,r):r[d].app.factories[t](e,r)}var v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t};function y(e,r){if(h(e,r[d].scope),!e)return document.createComment("");switch(void 0===e?"undefined":v(e)){case"string":return document.createTextNode(e);case"object":if(e.component){var t=m(e.component,e.props,r);return e.ref&&e.ref(t),j(t),t[d].dom}var o=document.createElement(e.tag);return o[d]={},o[d].attrs={},o[d].props={},Object.keys(e.attrs).forEach(function(t){null!==e.attrs[t]&&(o.setAttribute(t,e.attrs[t]),o[d].attrs[t]=e.attrs[t])}),Object.keys(e.props).forEach(function(t){null!==e.props[t]&&(o[t]=e.props[t],o[d].props[t]=e.props[t])}),e.children.forEach(function(t){o.appendChild(y(t,r))}),e.ref&&e.ref(o),o}}function b(t,e,r){if(t[d]&&t[d].id){var o=t[d].id,n=r[d].children[o];if(e.props||(e.props={}),n[d].name===e.component)return n[d].dom=t,s=n,a=e.props,s[d].shouldUpdateProps(s.props,a)&&(s.props=a,render(s)),void(e.ref&&e.ref(n));r[d].removeChild(o)}var s,a,i=m(e.component,e.props,r);i[d].dom=t,e.ref&&e.ref(i),j(i)}function E(r,o,n){if(h(o,n[d].scope),o&&o.component)b(r,o,n);else{if(e=r,!((s=o)?"object"===(void 0===s?"undefined":v(s))&&1===e.nodeType?s.tag.toUpperCase()===e.tagName:"string"==typeof s&&3===e.nodeType:8===e.nodeType)){r[d]&&r[d].id&&function e(t,r){if(t[d].children[r]){var o=t[d].children[r];p(o,"willRemove"),delete o[d].dom,Object.keys(o[d].children).forEach(function(t){e(t,o)}),p(o,"didRemove"),delete t[d].children[r]}}(n,r[d].id);var t=y(o,n);return r.parentNode.replaceChild(t,r),void(n[d].dom===r&&(n[d].dom=t))}var e,s;switch(r.nodeType){case 1:var a=[];r[d].attrs&&Object.keys(r[d].attrs).forEach(function(t){a.push(t)}),r[d].attrs||(r[d].attrs={}),Object.keys(o.attrs).forEach(function(t){null===o.attrs[t]?(r.removeAttribute(t),delete r[d].attrs[t]):r[t]!==o.attrs[t]&&(r.setAttribute(t,o.attrs[t]),r[d].attrs[t]=o.attrs[t]);var e=a.indexOf(t);-1<e&&a.splice(e,1)}),a.forEach(function(t){r.removeAttribute(t),delete r[d].attrs[t]});var i=[];for(r[d].props&&Object.keys(r[d].props).forEach(function(t){i.push(t)}),r[d].props||(r[d].props={}),Object.keys(o.props).forEach(function(t){null===o.props[t]?(r[t]=null,delete r[d].props[t]):r[t]!==o.props[t]&&(r[t]=o.props[t],r[d].props[t]=o.props[t]);var e=i.indexOf(t);-1<e&&i.splice(e,1)}),i.forEach(function(t){r[t]=null,delete r[d].props[t]}),o.children||(o.children=[]),o.children.forEach(function(t,e){r.childNodes[e]?E(r.childNodes[e],t,n):r.appendChild(y(t,n))});r.childNodes[o.children.length];){var c=r.childNodes[o.children.length];r.removeChild(c)}o.ref&&o.ref(r);break;case 3:r.nodeValue!==o&&(r.nodeValue=o)}}}function j(t){var e=!t[d].dom;p(t,e?"willMount":"willUpdate");var r=t[d].render(o,n);if("object"!==(void 0===r?"undefined":v(r))||r.component||!r.tag)throw new ModesteError(t[d].name+": Component root must be a tag");e?t[d].dom=y(r,t):E(t[d].dom,r,t),t[d].dom[d].id=t[d].id,p(t,e?"didMount":"didUpdate")}function O(e,t){var r,o,n=this;this[d]={},e.manifest.factories||(e.manifest.factories={}),this[d].factories=e.manifest.factories,this[d].app=t||this,this[d].name=e.name,this[d].id=e.id,this[d].scope=e.scope,this[d].children={},this[d].render=e.manifest.render.bind(this),this[d].shouldUpdateData=s,this[d].shouldUpdateProps=i,r=this,o=e.manifest,c.forEach(function(t){o[t]&&(r[d][t]=o[t].bind(r))}),p(this,"willCreate"),this.props=e.props?e.props:{},e.manifest.data&&(this[d].data=e.manifest.data(),Object.keys(this[d].data).forEach(function(e){return Object.defineProperty(n,e,{enumerable:!0,get:function(){return this[d].data[e]},set:function(t){this[d].shouldUpdateData(this[d].data[e],t)&&(this[d].data[e]=t,j(this))}})})),e.manifest.components&&Object.keys(e.manifest.components).forEach(function(t){!function(t,n,s){if(!t[d].factories[n]){var a=u(n);l(s.style(),a),t[d].factories[n]=function(t,e){var r=f(1e6,e[d].children),o=new O({name:n,manifest:s,scope:a,id:r,props:t},e[d].app);return e[d].children[r]=o}}}(n,t,e.manifest.components[t])}),e.manifest.methods&&Object.keys(e.manifest.methods).forEach(function(t){n[t]=e.manifest.methods[t].bind(n)}),p(this,"didCreate")}O.prototype.render=function(){j(this)};var r=u(e);function k(t){O.call(this,{name:e,id:e,manifest:t,scope:r}),t.style&&l(t.style(),r),this[d].wrap=document.querySelector(t.selector)}return((k.prototype=Object.create(O.prototype)).constructor=k).prototype.render=function(){O.prototype.render.call(this),0===this[d].wrap.childNodes.length&&this[d].wrap.appendChild(this[d].dom)},k}();
//# sourceMappingURL=modeste.browser.js.map
