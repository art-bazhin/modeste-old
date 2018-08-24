import { INTERNAL_VAR_NAME as m } from '../constants';
import Component from './Component';
import generateScope from './generateScope';
import addStyles from '../dom/addStyles';

export default function registerComponent(parent, name, manifest) {
  if (!parent[m].factories[name]) {
    let scope = manifest.scope !== false ? generateScope(name) : false;

    if (manifest.style) addStyles(manifest.style(), scope);

    parent[m].factories[name] = (props, parent) =>
      new Component(
        {
          name,
          manifest,
          scope,
          props
        },
        parent
      );
  }
}
