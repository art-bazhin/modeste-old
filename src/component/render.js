import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';
import e from '../vDom/createElementNode';
import c from '../vDom/createComponentNode';
import createDom from '../dom/createDom';
import updateDom from '../dom/updateDom';
import ModesteError from '../utils/ModesteError';

export default function render(component) {
  if (component[m].render) {
    if (!component[m].mounted) emitHook(component, 'willMount');
    else emitHook(component, 'willUpdate');

    let vDom = component[m].render(e, c);

    if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
      throw new ModesteError(
        `${component[m].name}: Component root must be a tag`
      );
    }

    if (!component[m].dom) {
      component[m].dom = createDom(vDom, component);
    } else {
      updateDom(component[m].dom, vDom, component);
    }

    component[m].dom[m].id = component[m].id;

    if (component[m].mounted) emitHook(component, 'didUpdate');
  } else emitHook(component, 'didUpdate');
}
