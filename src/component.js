import { createDom, updateDom } from './dom';
import { processStyle, shallowCompare, strictEqual, generateId } from './utils';
import { INTERNAL_VAR_NAME as m } from './constants';
import ModesteError from './error';

let scopes = {};

let hooks = [
  'willCreate',
  'didCreate',
  'willMount',
  'didMount',
  'willUpdate',
  'didUpdate',
  'willRemove',
  'didRemove',
  'shouldUpdateData',
  'shouldUpdateProps'
];

export default class Component {
  constructor(opts, app) {
    this[m] = {};

    if (!opts.manifest.factories) opts.manifest.factories = {};
    this[m].factories = opts.manifest.factories;
    this[m].app = app ? app : this;
    this[m].name = opts.name;
    this[m].id = opts.id;
    this[m].scope = opts.scope;
    this[m].children = {};
    this[m].render = opts.manifest.render.bind(this);
    this[m].registerComponent = registerComponent.bind(this);
    this[m].removeChild = removeChild.bind(this);
    this[m].emitHook = emitHook.bind(this);
    this[m].setProps = setProps.bind(this);
    this[m].shouldUpdateData = shouldUpdateData.bind(this);
    this[m].shouldUpdateProps = shouldUpdateProps.bind(this);

    this.props = opts.props ? opts.props : {};

    if (opts.manifest.data) {
      this[m].data = opts.manifest.data();

      Object.keys(this[m].data).forEach(prop =>
        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[m].data[prop];
          }.bind(this),
          set: function(value) {
            if (this[m].shouldUpdateData(this[m].data[prop], value)) {
              this[m].data[prop] = value;
              this.render();
            }
          }.bind(this)
        })
      );
    }

    if (opts.manifest.components) {
      Object.keys(opts.manifest.components).forEach(name => {
        this[m].registerComponent(name, opts.manifest.components[name]);
      });
    }

    if (opts.manifest.methods) {
      Object.keys(opts.manifest.methods).forEach(method => {
        this[method] = opts.manifest.methods[method].bind(this);
      });
    }
  }

  render() {
    let vDom = this[m].render();

    if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
      throw new ModesteError(`${this[m].name}: Component root must be a tag`);
    }

    if (!this[m].dom) {
      this[m].emitHook('willMount');
      this[m].dom = createDom(vDom, this, true);
      this[m].emitHook('didMount');
    } else {
      this[m].emitHook('willUpdate');
      updateDom(this[m].dom, vDom, this, true);
      this[m].emitHook('didUpdate');
    }

    this[m].dom._modesteId = this[m].id;
  }

  static generateScope(name) {
    return generateId(10000, scopes, id => name + id);
  }
}

function emitHook(hook) {
  if (this[hook]) this[hook]();
}

function registerComponent(name, manifest) {
  if (!this[m].factories[name]) {
    let scope = Component.generateScope(name);

    processStyle(manifest.style(), scope);

    this[m].factories[name] = (props, parent) => {
      let id = generateId(10000, parent[m].children);

      let component = new Component(
        {
          name,
          manifest,
          scope,
          id,
          props
        },
        parent[m].app
      );

      parent[m].children[id] = component;

      return component;
    };
  }
}

function removeChild(id) {
  if (this[m].children[id]) {
    let component = this[m].children[id];

    component[m].emitHook('willUnmount');
    delete component[m].dom;

    Object.keys(component[m].children).forEach(id => {
      component.removeChild(id);
    });

    component[m].emitHook('didUnmount');
    delete this[m].children[id];
  }
}

function shouldUpdateData(oldValue, newValue) {
  return !strictEqual(oldValue, newValue);
}

function shouldUpdateProps(props) {
  return !shallowCompare(this.props, props);
}

function setProps(props) {
  if (this[m].shouldUpdateProps(props)) {
    this.props = props;
    this.render();
  }
}
