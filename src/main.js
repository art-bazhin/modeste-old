import { processStyle } from './utils';
import { ROOT_NAME, INTERNAL_VAR_NAME as m } from './constants';
import { generateScope } from './component';
import Component from './component';

let scope = generateScope(ROOT_NAME);

export default function Modeste(manifest) {
  Component.call(this, {
    name: ROOT_NAME,
    id: ROOT_NAME,
    manifest,
    scope
  });

  if (manifest.style) processStyle(manifest.style(), scope);
  this[m].wrap = document.querySelector(manifest.selector);
}

Modeste.prototype = Object.create(Component.prototype);
Modeste.prototype.constructor = Modeste;

Modeste.prototype.render = function() {
  Component.prototype.render.call(this);

  if (this[m].wrap.childNodes.length === 0) {
    this[m].wrap.appendChild(this[m].dom);
  }
};
