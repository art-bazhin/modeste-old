import { INTERNAL_VAR_NAME as m } from '../constants';
import shouldUpdateData from './shouldUpdateData';
import shouldUpdateProps from './shouldUpdateProps';
import registerHooks from './registerHooks';
import emitHook from './emitHook';
import registerComponent from './registerComponent';
import render from './render';

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

Component.prototype.render = function() {
  render(this);
};
