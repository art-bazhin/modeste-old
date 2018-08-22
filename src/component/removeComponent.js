import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';

export default function removeComponent(component) {
  emitHook(component, 'willRemove');

  let parent = component[m].parent;
  let id = component[m].id;

  Object.keys(component[m].children).forEach(child => {
    removeComponent(child);
  });

  component[m].subscriptions.forEach(item => {
    let store = item.store;
    item.fields.forEach(field => {
      if (store[m].data.hasOwnProperty(field))
        delete store[m].subscribers[field][id];
    });
  });

  component[m].mounted = false;
  delete component[m].dom;
  if (parent) delete parent[m].children[id];

  emitHook(component, 'didRemove');
}
