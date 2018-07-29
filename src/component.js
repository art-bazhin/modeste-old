import { createDom, updateDom } from './dom';
import { processStyle, updateState } from './utils';

let scopeClasses = {};
let hooks = [
  'beforeCreate',
  'created',
  'beforeMount',
  'mounted',
  'beforeUpdate',
  'updated',
  'beforeDestroy',
  'destroyed'
];

export default class Component {
  constructor(name, opts, scopeClass, id, J, props) {
    this.J = J ? J : this;
    this.name = name;
    this.id = id;
    this.scopeClass = scopeClass;
    this.props = props ? props : {};
    this.styleNodes = {};
    this.components = {};
    this.componentPool = {};

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
    if (!this.components[name]) {
      let scopeClass = Component.generateScopeClass(name);

      if (opts.style) {
        this.styleNodes[name] = processStyle(opts.style(), scopeClass);
      }

      this.components[name] = props => {
        let id = this.generateComponentId();
        let component = new Component(
          name,
          opts,
          scopeClass,
          id,
          this.J,
          props
        );

        this.componentPool[id] = component;

        return component;
      };
    }
  }

  removeComponent(id) {
    if (this.componentPool[id]) {
      let component = this.componentPool[id];

      delete component.dom;

      Object.keys(component.styleNodes).forEach(name => {
        let node = component.styleNodes[name];
        node.parentNode.removeChild(node);
      });

      Object.keys(component.componentPool).forEach(id => {
        component.removeComponent(id);
      });

      delete this.componentPool[id];
    }
  }

  render() {
    let vDom = this._renderFunc();

    // TODO error handling
    if (typeof vDom !== 'object' || vDom.component) return;

    if (!this.dom) {
      this.dom = createDom(vDom, this, true);
    } else {
      updateDom(this.dom, vDom, this, true);
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
    let id;

    do {
      id = Component.generateId();
    } while (this.componentPool[id]);

    return id;
  }

  emit(event, ...args) {
    if (this.props['on' + event]) {
      this.props['on' + event](...args);
    }
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
