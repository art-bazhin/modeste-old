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

export default class Component {
  constructor(opts, parent) {
    let id = generateId();

    this[m] = {};
    registerHooks(this, opts.manifest);
    emitHook(this, 'willCreate');

    this[m].id = id;
    if (parent) parent[m].children[id] = this;

    this[m].name = opts.name;
    this[m].factories = opts.manifest.factories ? opts.manifest.factories : {};
    this[m].parent = parent;
    this[m].app = parent ? parent[m].app : this;
    this[m].scope = opts.scope;
    this[m].children = {};
    this[m].props = opts.props ? opts.props : {};
    this[m].defaultProps = opts.defaultProps;
    this[m].subscribers = {};

    this[m].subscriptions = opts.manifest.subscriptions
      ? opts.manifest.subscriptions
      : [];

    this[m].render = opts.manifest.render
      ? opts.manifest.render.bind(this)
      : null;

    this[m].shouldUpdateData = shouldUpdateData;
    this[m].shouldUpdateProps = shouldUpdateProps;

    this[m].subscriptions.forEach(item => {
      let store = item.store;
      item.fields.forEach(field => {
        if (store[m].data.hasOwnProperty(field))
          store[m].subscribers[field][opts.id] = this;
      });
    });

    if (opts.manifest.props) {
      opts.manifest.props.forEach(prop => {
        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[m].props[prop]
              ? this[m].props[prop]
              : this[m].defaultProps[prop];
          }
        });
      });
    }

    if (opts.manifest.data) {
      this[m].data = opts.manifest.data.bind(this)();

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
