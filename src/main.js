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

    this.wrap = document.querySelector(manifest.selector);
    this.globals = manifest.globals;
  }

  render() {
    super.render();
    if (this.wrap.childNodes.length === 0) {
      this.wrap.appendChild(this.dom);
    }
  }
}
