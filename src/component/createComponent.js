import { INTERNAL_VAR_NAME as m } from '../constants';

export default function createComponent(name, props, parent) {
  if (parent[m].factories[name]) {
    return parent[m].factories[name](props, parent);
  }

  return parent[m].app.factories[name](props, parent);
}
