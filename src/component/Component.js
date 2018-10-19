import { INTERNAL_VAR_NAME as m } from '../constants';
import shouldUpdateData from './shouldUpdateData';
import shouldUpdateProps from './shouldUpdateProps';
import registerHooks from './registerHooks';
import emitHook from './emitHook';
import registerComponent from './registerComponent';
import render from './render';
import asyncRender from './asyncRender';
import generateId from '../utils/generateId';
import assign from '../utils/assign';
import getScope from './getScope';
import validateProps from './validateProps';

export default class Component {
  constructor(manifest, name, props, parent) {
    let id = generateId();
    let scope = false;

    if (manifest.scoped !== false) {
      scope = manifest[m] ? manifest[m].scope : getScope(generateId());
    }

    this[m] = {};
    registerHooks(this, manifest);
    emitHook(this, 'willCreate');

    this[m].id = id;
    if (parent) parent[m].children[id] = this;

    this[m].name = name;
    this[m].factories = {};
    this[m].parent = parent;
    this[m].app = parent ? parent[m].app : this;
    this[m].scope = scope;
    this[m].children = {};
    this[m].props = {};

    this[m].subscribers = {};

    this[m].subscriptions = manifest.subscriptions
      ? manifest.subscriptions
      : [];

    this[m].render = manifest.render ? manifest.render.bind(this) : null;

    this[m].shouldUpdateData = shouldUpdateData;
    this[m].shouldUpdateProps = shouldUpdateProps;

    this[m].subscriptions.forEach(item => {
      let store = item.store;
      item.fields.forEach(field => {
        if (store[m].data.hasOwnProperty(field))
          store[m].subscribers[field][id] = this;
      });
    });

    if (manifest.props) {
      Object.keys(props).forEach(key => {
        if (props[key] === undefined) delete props[key];
      });

      this[m].propList = manifest.props;
      this[m].props = props ? props : {};
      this[m].defaultProps = manifest.defaultProps;

      if (this[m].defaultProps)
        this[m].props = assign({}, this[m].defaultProps, this[m].props);

      validateProps(this[m].props, manifest.props, this);

      Object.keys(manifest.props).forEach(prop => {
        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[m].props[prop];
          }
        });
      });
    }

    if (manifest.data) {
      this[m].data = manifest.data.bind(this)();

      Object.keys(this[m].data).forEach(prop => {
        this[m].subscribers[prop] = {};

        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[m].data[prop];
          },
          set: function(value) {
            if (this[m].shouldUpdateData(this[m].data[prop], value)) {
              this[m].data[prop] = value;
              asyncRender(this);

              let subscribers = this[m].subscribers[prop];
              Object.keys(subscribers).forEach(key =>
                asyncRender(subscribers[key])
              );
            }
          }
        });
      });
    }

    if (manifest.components) {
      Object.keys(manifest.components).forEach(name => {
        registerComponent(this, name, manifest.components[name]);
      });
    }

    if (manifest.methods) {
      Object.keys(manifest.methods).forEach(method => {
        this[method] = manifest.methods[method].bind(this);
      });
    }

    emitHook(this, 'didCreate');
  }

  get $data() {
    return assign({}, this[m].data);
  }

  set $data(data) {
    Object.keys(data).forEach(key => {
      if (this[m].data !== undefined) this[key] = data[key];
    });
  }

  get $props() {
    return assign({}, this[m].props);
  }

  get $app() {
    return this[m].app;
  }

  get $dom() {
    return this[m].dom;
  }

  $render() {
    render(this);
  }
}
