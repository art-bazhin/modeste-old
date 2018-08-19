import { ROOT_NAME, INTERNAL_VAR_NAME as m } from './constants';
import Component from './component/Component';
import generateScope from './component/generateScope';
import addStyles from './dom/addStyles';
import emitMount from './component/emitMount';

let scope = generateScope(ROOT_NAME);

export default class Modeste extends Component {
  constructor(manifest) {
    super({
      name: ROOT_NAME,
      id: ROOT_NAME,
      manifest,
      scope
    });

    if (manifest.style) addStyles(manifest.style(), scope);
    this[m].wrap = document.querySelector(manifest.selector);
  }

  render() {
    super.render();

    if (this[m].wrap.childNodes.length === 0) {
      this[m].wrap.appendChild(this[m].dom);
      emitMount(this);
    }
  }
}
