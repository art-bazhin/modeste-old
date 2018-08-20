import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';
import t from '../vDom/createTagNode';
import c from '../vDom/createComponentNode';
import createDom from '../dom/createDom';
import updateDom from '../dom/updateDom';
import ModesteError from '../utils/ModesteError';

export default function render(component) {
  const mounting = !component[m].dom;

  if (mounting) emitHook(component, 'willMount');
  else emitHook(component, 'willUpdate');

  let vDom = component[m].render(t, c);

  if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
    throw new ModesteError(
      `${component[m].name}: Component root must be a tag`
    );
  }

  if (mounting) {
    component[m].dom = createDom(vDom, component, true);
  } else {
    updateDom(component[m].dom, vDom, component, true);
  }

  component[m].dom[m].id = component[m].id;

  if (!mounting) emitHook(component, 'didUpdate');
}
