import { processStyle } from './utils';
import { ROOT_NAME, INTERNAL_VAR_NAME as m } from './constants';
import Component from './component';

let scope = Component.generateScope(ROOT_NAME);

export default class Modeste extends Component {
  constructor(manifest) {
    super({
      name: ROOT_NAME,
      id: ROOT_NAME,
      manifest,
      scope
    });

    if (manifest.style) processStyle(manifest.style(), scope);

    this[m].wrap = document.querySelector(manifest.selector);
  }

  render() {
    super.render();
    if (this[m].wrap.childNodes.length === 0) {
      this[m].wrap.appendChild(this[m].dom);
    }
  }
}
