import { createDom, updateDom } from './dom';
import { processStyle, updateState, generateId } from './utils';
import JustError from './error';

let scopes = {};

export default class Component {
  constructor(opts, app) {
    this._justInternal = {};

    if (!opts.manifest.factories) opts.manifest.factories = {};
    this._justInternal.factories = opts.manifest.factories;
    this._justInternal.app = app ? app : this;
    this._justInternal.name = opts.name;
    this._justInternal.id = opts.id;
    this._justInternal.scope = opts.scope;
    this._justInternal.children = {};
    this._justInternal.render = opts.manifest.render.bind(this);
    this._justInternal.registerComponent = registerComponent.bind(this);
    this._justInternal.removeChild = removeChild.bind(this);
    this._justInternal.emitHook = emitHook.bind(this);

    this.props = opts.props ? opts.props : {};

    if (!opts.manifest.state) {
      this._justInternal.state = {};
    } else {
      this._justInternal.state = opts.manifest.state();
    }

    if (opts.manifest.components) {
      Object.keys(opts.manifest.components).forEach(name => {
        this._justInternal.registerComponent(name, opts.manifest.components[name]);
      });
    }

    if (opts.manifest.methods) {
      Object.keys(opts.manifest.methods).forEach(method => {
        this[method] = opts.manifest.methods[method].bind(this);
      });
    }
  }

  render() {
    let vDom = this._justInternal.render();

    if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
      throw new JustError(`${this._justInternal.name}: Component root must be a tag`);
    }

    if (!this._justInternal.dom) {
      this._justInternal.emitHook('willMount');
      this._justInternal.dom = createDom(vDom, this, true);
      this._justInternal.emitHook('didMount');
    } else {
      this._justInternal.emitHook('willUpdate');
      updateDom(this._justInternal.dom, vDom, this, true);
      this._justInternal.emitHook('didUpdate');
    }

    this._justInternal.dom._justId = this.id;
  }

  set state(state) {
    if (updateState(this._justInternal.state, state)) {
      this.render();
    }
  }

  get state() {
    return this._justInternal.state;
  }

  static generateScope(name) {
    return generateId(10000, scopes, id => name + id);
  }
}

function emitHook(hook) {
  if (this[hook]) this[hook]();
}

function registerComponent(name, manifest) {
  if (!this._justInternal.factories[name]) {
    let scope = Component.generateScope(name);

    processStyle(manifest.style(), scope);

    this._justInternal.factories[name] = (props, parent) => {
      let id = generateId(10000, parent._justInternal.children);

      let component = new Component(
        {
          name,
          manifest,
          scope,
          id,
          props
        },
        parent._justInternal.app
      );

      parent._justInternal.children[id] = component;

      return component;
    };
  }
}

function removeChild(id) {
  if (this._justInternal.children[id]) {
    let component = this._justInternal.children[id];

    component._justInternal.emitHook('willUnmount');
    delete component._justInternal.dom;

    Object.keys(component.components).forEach(id => {
      component.removeChild(id);
    });

    component._justInternal.emitHook('didUnmount');
    delete this._justInternal.children[id];
  }
}
