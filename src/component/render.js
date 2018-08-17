import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';
import t from '../render/tag';
import c from '../render/component';
import createDom from '../dom/createDom';
import updateDom from '../dom/updateDom';

export default function render(component) {
  let isMounting = !component[m].dom;

  if (isMounting) emitHook(component, 'willMount');
  else emitHook(component, 'willUpdate');

  let vDom = component[m].render(t, c);

  if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
    throw new ModesteError(
      `${component[m].name}: Component root must be a tag`
    );
  }

  if (isMounting) {
    component[m].dom = createDom(vDom, component, true);
  } else {
    updateDom(component[m].dom, vDom, component, true);
  }

  component[m].dom[m].id = component[m].id;

  if (isMounting) emitHook(component, 'didMount');
  else emitHook(component, 'didUpdate');
}
