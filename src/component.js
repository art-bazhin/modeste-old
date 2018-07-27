import { createDom, updateDom } from './dom';
import { processStyle, updateState } from './utils';

let idList = {};

export default class Component {
  constructor(name, opts, J) {
    this.J = J ? J : this;
    this.name = name;

    this.prefix = Component.generatePrefix(this.name);
    if (opts.style) processStyle(opts.style(J), this.prefix);

    if (typeof opts.state === 'function') {
      this._state = opts.state();
    } else {
      this._state = opts.state;
    }

    this._renderFunc = opts.render.bind(this);

    if (opts.components) {
      Object.keys(opts.components).forEach(name => {
        this.registerComponent(name, opts.components[name]);
      });
    }

    if (opts.methods) {
      Object.keys(opts.methods).forEach(method => {
        this[method] = opts.methods[method].bind(this);
      });
    }

    this.componentPool = [];

    if (this.created) this.created();
  }

  registerComponent(name, component) {
    if (!this.components) this.components = {};

    if (!this.components.name) {
      this.components[name] = () => {
        return new Component(name, component, this.J);
      };
    }
  }

  render() {
    let vDom = this._renderFunc();

    if (!this.dom) {
      this.dom = createDom(vDom, this);
    } else {
      updateDom(this.dom, vDom, this);
    }

    this.dom._justComponent = this;
  }

  set state(state) {
    if (updateState(this._state, state)) {
      this.render();
    }
  }

  get state() {
    return this._state;
  }

  static generatePrefix(name) {
    let id;

    do {
      id = Component.generateId();
    } while (idList[id]);

    idList[id] = true;

    return name + id;
  }

  static generateId() {
    return (Math.random() * 10000).toFixed(0);
  }
}
