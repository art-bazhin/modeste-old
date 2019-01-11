import { ROOT_NAME, INTERNAL_VAR_NAME as m } from './constants';
import Component from './component/Component';
import addStyles from './dom/addStyles';
import emitMount from './component/emitMount';
import setProps from './component/setProps';

export default class Modeste extends Component {
  constructor(manifest, element, props) {
    if (typeof element === 'string') element = document.querySelector(element);

    super(manifest, ROOT_NAME, props);
    this[m].isApp = true;

    if (manifest.style) addStyles(manifest.style(), this[m].scope);
    this[m].wrap = element || null;

    this.$render();
  }

  get $wrap() {
    return this[m].wrap;
  }

  set $props(props) {
    setProps(this, props);
  }

  $render() {
    super.$render();

    if (!this[m].render) return;

    if (!this[m].mounted) {
      if (!this[m].wrap) return emitMount(this);

      while (this[m].wrap.firstChild)
        this[m].wrap.removeChild(this[m].wrap.firstChild);

      this[m].wrap.appendChild(this[m].dom);
      emitMount(this);
    }
  }
}
