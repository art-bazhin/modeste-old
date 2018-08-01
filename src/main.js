import Component from './component';
import { processStyle } from './utils';
import { ROOT_NAME } from './constants';

let scope = Component.generateScope(ROOT_NAME);

export default class Just extends Component {
  constructor(manifest) {
    super({
      name: ROOT_NAME,
      id: ROOT_NAME,
      manifest,
      scope
    });

    if (manifest.style) processStyle(manifest.style(), scope);

    this._justInternal.wrap = document.querySelector(manifest.selector);
  }

  render() {
    super.render();
    if (this._justInternal.wrap.childNodes.length === 0) {
      this._justInternal.wrap.appendChild(this._justInternal.dom);
    }
  }
}
