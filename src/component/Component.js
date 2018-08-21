import { INTERNAL_VAR_NAME as m } from '../constants';
import shouldUpdateData from './shouldUpdateData';
import shouldUpdateProps from './shouldUpdateProps';
import registerHooks from './registerHooks';
import emitHook from './emitHook';
import registerComponent from './registerComponent';
import render from './render';
import asyncRender from './asyncRender';

export default class Component {
  constructor(opts, parent) {
    this[m] = {};

    if (!opts.manifest.factories) opts.manifest.factories = {};

    this[m].factories = opts.manifest.factories;
    this[m].parent = parent;
    this[m].app = parent ? parent[m].app : this;
    this[m].name = opts.name;
    this[m].id = opts.id;
    this[m].scope = opts.scope;
    this[m].children = {};
    this[m].props = opts.props ? opts.props : {};

    this[m].render = opts.manifest.render.bind(this);
    this[m].shouldUpdateData = shouldUpdateData;
    this[m].shouldUpdateProps = shouldUpdateProps;

    registerHooks(this, opts.manifest);
    emitHook(this, 'willCreate');

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
              asyncRender(this);
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

  get $data() {
    return this[m].data;
  }

  get $props() {
    return this[m].props;
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
