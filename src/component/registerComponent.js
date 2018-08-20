import { INTERNAL_VAR_NAME as m } from '../constants';
import Component from './Component';
import generateScope from './generateScope';
import generateId from '../utils/generateId';
import addStyles from '../dom/addStyles';

export default function registerComponent(parent, name, manifest) {
  if (!parent[m].factories[name]) {
    let scope = manifest.scope !== false ? generateScope(name) : false;

    addStyles(manifest.style(), scope);

    parent[m].factories[name] = (props, parent) => {
      let id = generateId(parent[m].children);

      let component = new Component(
        {
          name,
          manifest,
          scope,
          id,
          props
        },
        parent
      );

      parent[m].children[id] = component;

      return component;
    };
  }
}
