import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';

export default function removeChild(parent, id) {
  if (parent[m].children[id]) {
    let component = parent[m].children[id];

    emitHook(component, 'willRemove');
    delete component[m].dom;

    Object.keys(component[m].children).forEach(id => {
      removeChild(id, component);
    });

    emitHook(component, 'didRemove');
    delete parent[m].children[id];
  }
}
