import { createDom, updateDom } from './dom';
import { processStyle, updateState } from './utils';

let scopes = {};
let hooks = [
  'willCreate',
  'created',
  'willMount',
  'mounted',
  'willUpdate',
  'updated',
  'willDestroy',
  'destroyed'
];

export default class Component {
  constructor(opts, J) {
    if (!opts.manifest.factories) opts.manifest.factories = {};
    this.factories = opts.manifest.factories;

    this.J = J ? J : this;
    this.name = opts.name;
    this.id = opts.id;
    this.scope = opts.scope;
    this.props = opts.props ? opts.props : {};
    this.components = {};

    if (typeof opts.manifest.state === 'function') {
      this._state = opts.manifest.state();
    } else {
      this._state = opts.manifest.state;
    }

    this._renderFunc = opts.manifest.render.bind(this);

    if (opts.manifest.components) {
      Object.keys(opts.manifest.components).forEach(name => {
        this.registerComponent(name, opts.manifest.components[name]);
      });
    }

    if (opts.manifest.methods) {
      Object.keys(opts.manifest.methods).forEach(method => {
        this[method] = opts.manifest.methods[method].bind(this);
      });
    }

    if (this.created) this.created();
  }

  registerComponent(name, manifest) {
    if (!this.factories[name]) {
      let scope = Component.generateScope(name);
      processStyle(manifest.style(), scope);

      this.factories[name] = (props, parent) => {
        let id = this.generateComponentId();
        let component = new Component(
          {
            name,
            manifest,
            scope,
            id,
            props
          },
          parent.J
        );

        parent.components[id] = component;

        return component;
      };
    }
  }

  removeComponent(id) {
    if (this.components[id]) {
      let component = this.components[id];

      delete component.dom;

      Object.keys(component.components).forEach(id => {
        component.removeComponent(id);
      });

      delete this.components[id];
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
    } while (this.components[id]);

    return id;
  }

  emit(event, ...args) {
    if (this.props['on' + event]) {
      this.props['on' + event](...args);
    }
  }

  static generateScope(name) {
    let id;

    do {
      id = Component.generateId();
    } while (scopes[id]);

    scopes[id] = true;

    return name + id;
  }

  static generateId() {
    return (Math.random() * 10000).toFixed(0);
  }
}
