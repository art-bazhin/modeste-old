import Component from './component';
import { processStyle } from './utils';

let scopeClass = Component.generateScopeClass('justRoot');

export default class Just extends Component {
  constructor(opts) {
    super('justRoot', opts, scopeClass, 'root');

    if (opts.style) processStyle(opts.style(), scopeClass);

    this.wrap = document.querySelector(opts.selector);
    this.globals = opts.globals;
  }

  render() {
    super.render();
    if (this.wrap.childNodes.length === 0) {
      this.wrap.appendChild(this.dom);
    }
  }
}
