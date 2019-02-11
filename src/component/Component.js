import { INTERNAL_VAR_NAME as m, ROOT_NAME, CORE_PROPS } from '../constants';
import shouldUpdateData from './shouldUpdateData';
import shouldUpdateProps from './shouldUpdateProps';
import registerHooks from './registerHooks';
import emitHook from './emitHook';
import registerComponent from './registerComponent';
import render from './render';
import asyncRender from './asyncRender';
import generateId from '../utils/generateId';
import assign from '../utils/assign';
import validateProps from './validateProps';
import getDefaultProps from './getDefaultProps';
import throwError from '../utils/throwError';

function defineProp(obj, key) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function() {
      return this[m].props[key];
    }
  });
}

function defineData(obj, key) {
  Object.defineProperty(obj, key, {
    enumerable: true,
    get: function() {
      return this[m].data[key];
    },
    set: function(value) {
      if (this[m].shouldUpdateData(this[m].data[key], value, key)) {
        let oldValue = this[m].data[key];
        this[m].data[key] = value;

        emitHook(this, 'didUpdateData', oldValue, value, key);
        asyncRender(this);

        let subscribers = this[m].subscribers[key];
        Object.keys(subscribers).forEach(key => asyncRender(subscribers[key]));
      }
    }
  });
}

export default class Component {
  constructor(manifest, name, props, parent) {
    let id = generateId();

    this[m] = {};
    this[m].shouldUpdateData = shouldUpdateData;
    this[m].shouldUpdateProps = shouldUpdateProps;

    registerHooks(this, manifest);
    emitHook(this, 'willCreate');

    this[m].id = id;
    if (parent) parent[m].children[id] = this;

    this[m].name = name;
    this[m].factories = {};
    this[m].parent = parent;
    this[m].app = parent ? parent[m].app : this;
    this[m].scope = manifest[m].scope;
    this[m].children = {};
    this[m].props = props || {};

    this[m].subscribers = {};

    this[m].subscriptions = manifest.subscriptions
      ? manifest.subscriptions
      : [];

    this[m].render = manifest.render ? manifest.render.bind(this) : null;

    if (
      MODESTE_ENV === 'development' &&
      !(this[m].subscriptions instanceof Array)
    ) {
      throwError('subscriptions list must be an array', this);
    }

    this[m].subscriptions.forEach(item => {
      if (
        MODESTE_ENV === 'development' &&
        !(item instanceof Component) &&
        (!item.store || !(item.store instanceof Component))
      ) {
        throwError(
          'subscription must be a component or contain component in the store field',
          this
        );
      }

      if (item.store) {
        let store = item.store;

        if (item.fields) {
          if (MODESTE_ENV === 'development' && item.fields instanceof Array) {
            throwError('subscription fields list must be an array', this);
          }

          item.fields.forEach(field => {
            if (store[m].data.hasOwnProperty(field))
              store[m].subscribers[field][id] = this;
          });
        } else {
          Object.keys(store[m].data).forEach(
            field => (store[m].subscribers[field][id] = this)
          );
        }
      } else {
        Object.keys(item[m].data).forEach(
          field => (item[m].subscribers[field][id] = this)
        );
      }
    });

    this[m].propList = manifest.props || null;
    if (MODESTE_ENV === 'development')
      validateProps(this[m].props, this[m].propList, this);

    if (manifest.props) {
      this[m].defaultProps = getDefaultProps(this[m].propList);
      this[m].props = assign({}, this[m].defaultProps, this[m].props);
      if (MODESTE_ENV === 'development')
        validateProps(this[m].props, this[m].propList, this);

      Object.keys(manifest.props).forEach(prop => defineProp(this, prop));
    }

    if (manifest.data) {
      this[m].data = assign({}, manifest.data);

      Object.keys(this[m].data).forEach(prop => {
        this[m].subscribers[prop] = {};
        defineData(this, prop);
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
