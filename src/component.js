import { createDom, updateDom } from './dom';
import { processStyle, updateState } from './utils';

export default class Component {
  constructor(name, opts, J) {
    this.J = J ? J : this;
    this.name = name;

    this.prefix = this.name + (Date.now() % 10000) + '_';
    if (opts.style) processStyle(opts.style(J), this.prefix);

    this._state = opts.state;
    this._renderFunc = opts.render;

    for (let name in opts.components) {
      this._registerComponent(name, opts.components[name]);
    }

    for (let method in opts.methods) {
      this[method] = opts.methods[method].bind(this);
    }
  }

  _registerComponent(name, component) {
    if (!this._componentConstructors) this._componentConstructors = {};

    if (!this._componentConstructors.name) {
      this._componentConstructors.name = () => {
        return new Component(name, component, this.J);
      };
    }
  }

  _render() {
    let vDom = this._renderFunc(this.J);

    if (!this.domNode) {
      this.domNode = createDom(vDom, this.prefix);
    } else {
      updateDom(this.domNode, vDom, this.prefix);
    }
  }

  set state(state) {
    if (updateState(this._state, state)) {
      this._render();
    }
  }

  get state() {
    return this._state;
  }
}
