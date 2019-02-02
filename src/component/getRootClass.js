import { INTERNAL_VAR_NAME as m } from '../constants';
import getScopedClassString from '../utils/getScopedClassString';

export default function getRootClass(component) {
  if (!component[m].props.$class) return '';
  if (!component[m].parent) return component[m].props.$class;

  return getScopedClassString(
    component[m].props.$class,
    component[m].parent[m].scope
  );
}
