import { INTERNAL_VAR_NAME as m } from '../constants';

export default function createComponent(name, props, parent) {
  return parent[m].factories[name](name, props, parent);
}
