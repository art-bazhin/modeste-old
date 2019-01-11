import { INTERNAL_VAR_NAME as m } from '../constants';
import Component from './Component';
import addStyles from '../dom/addStyles';
import generateId from '../utils/generateId';
import getScope from './getScope';

let factories = {};
let appCounter = 0;

export default function registerComponent(parent, name, manifest) {
  if (!manifest[m]) {
    let id = generateId();
    let scope = null;

    if (parent) {
      scope =
        manifest.scoped !== false ? getScope(parent[m].name, name) : false;
    } else {
      scope =
        manifest.scoped !== false
          ? getScope('app-' + appCounter.toString(36), name)
          : false;
      appCounter++;
    }

    manifest[m] = { id, scope };
    if (manifest.style) addStyles(manifest.style(), scope);

    factories[id] = (name, props, parent) =>
      new Component(manifest, name, props, parent);
  }

  if (parent) parent[m].factories[name] = factories[manifest[m].id];
}
