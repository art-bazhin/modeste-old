import { INTERNAL_VAR_NAME as m } from '../constants';

export default function createComponent(name, props, parentComponent) {
  return parentComponent[m].factories[name](name, props, parentComponent);
}
