import Component from './component';

export default class Just extends Component {
  constructor(opts) {
    super('justRoot', opts);

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
