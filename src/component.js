import { createDom, updateDom } from './dom';
import { processStyle, shallowCompare, strictEqual, generateId } from './utils';
import { INTERNAL_VAR_NAME as m } from './constants';
import ModesteError from './error';

const HOOKS = [
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

let scopes = {};

export default function Component(opts, app) {
  this[m] = {};

  if (!opts.manifest.factories) opts.manifest.factories = {};

  this[m].factories = opts.manifest.factories;
  this[m].app = app ? app : this;
  this[m].name = opts.name;
  this[m].id = opts.id;
  this[m].scope = opts.scope;
  this[m].children = {};

  this[m].render = opts.manifest.render.bind(this);
  this[m].shouldUpdateData = shouldUpdateData;
  this[m].shouldUpdateProps = shouldUpdateProps;

  this.render = function() {
    render(this);
  };

  registerHooks(this, opts.manifest);
  emitHook(this, 'willCreate');

  this.props = opts.props ? opts.props : {};

  if (opts.manifest.data) {
    this[m].data = opts.manifest.data();

    Object.keys(this[m].data).forEach(prop =>
      Object.defineProperty(this, prop, {
        enumerable: true,
        get: function() {
          return this[m].data[prop];
        },
        set: function(value) {
          if (this[m].shouldUpdateData(this[m].data[prop], value)) {
            this[m].data[prop] = value;
            render(this);
          }
        }
      })
    );
  }

  if (opts.manifest.components) {
    Object.keys(opts.manifest.components).forEach(name => {
      registerComponent(this, name, opts.manifest.components[name]);
    });
  }

  if (opts.manifest.methods) {
    Object.keys(opts.manifest.methods).forEach(method => {
      this[method] = opts.manifest.methods[method].bind(this);
    });
  }

  emitHook(this, 'didCreate');
}

export function generateScope(name) {
  return generateId(10000, scopes, id => name + id);
}

export function render(component) {
  let isMounting = !component[m].dom;

  if (isMounting) emitHook(component, 'willMount');
  else emitHook(component, 'willUpdate');

  let vDom = component[m].render();

  if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
    throw new ModesteError(
      `${component[m].name}: Component root must be a tag`
    );
  }

  if (isMounting) {
    component[m].dom = createDom(vDom, component, true);
  } else {
    updateDom(component[m].dom, vDom, component, true);
  }

  component[m].dom[m].id = component[m].id;

  if (isMounting) emitHook(component, 'didMount');
  else emitHook(component, 'didUpdate');
}

export function setProps(component, props) {
  if (component[m].shouldUpdateProps(component.props, props)) {
    component.props = props;
    render(component);
  }
}

export function removeChild(parent, id) {
  if (parent[m].children[id]) {
    let component = this[m].children[id];

    emitHook(component, 'willRemove');
    delete component[m].dom;

    Object.keys(component[m].children).forEach(id => {
      removeChild(id, component);
    });

    emitHook(component, 'didRemove');
    delete parent[m].children[id];
  }
}

function registerHooks(component, manifest) {
  HOOKS.forEach(hook => {
    if (manifest[hook]) component[m][hook] = manifest[hook].bind(component);
  });
}

function emitHook(component, hook) {
  if (component[m][hook]) component[m][hook]();
}

function registerComponent(parent, name, manifest) {
  if (!parent[m].factories[name]) {
    let scope = generateScope(name);

    processStyle(manifest.style(), scope);

    parent[m].factories[name] = (props, parent) => {
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

function shouldUpdateData(oldValue, newValue) {
  return !strictEqual(oldValue, newValue);
}

function shouldUpdateProps(oldProps, newProps) {
  !shallowCompare(oldProps, newProps);
}
