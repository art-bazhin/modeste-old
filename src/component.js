import { createDom, updateDom } from './dom';
import { processStyle, updateState } from './utils';

let scopeClasses = {};

export default class Component {
  constructor(name, opts, scopeClass, id, J) {
    this.J = J ? J : this;
    this.name = name;

    this.id = id;
    this.scopeClass = scopeClass;
    if (opts.style) processStyle(opts.style(J), this.scopeClass);

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

    if (this.created) this.created();
  }

  registerComponent(name, opts) {
    if (!this.components) this.components = {};

    if (!this.components.name) {
      let scopeClass = Component.generateScopeClass(name);
      this.components[name] = () => {
        let id = this.generateComponentId();
        let component = new Component(name, opts, scopeClass, id, this.J);

        this.componentPool[id] = component;

        return component;
      };
    }
  }

  render() {
    let vDom = this._renderFunc();

    // TODO error handling
    if (typeof vDom !== 'object' || vDom.component) return;

    if (!this.dom) {
      this.dom = createDom(vDom, this);
    } else {
      updateDom(this.dom, vDom, this);
    }

    this.dom._justId = this.id;
  }

  set state(state) {
    if (updateState(this._state, state)) {
      this.render();
    }
  }

  get state() {
    return this._state;
  }

  generateComponentId() {
    if (!this.componentPool) this.componentPool = {};
    let id;

    do {
      id = Component.generateId();
    } while (this.componentPool[id]);

    return id;
  }

  static generateScopeClass(name) {
    let id;

    do {
      id = Component.generateId();
    } while (scopeClasses[id]);

    scopeClasses[id] = true;

    return name + id;
  }

  static generateId() {
    return (Math.random() * 10000).toFixed(0);
  }
}
