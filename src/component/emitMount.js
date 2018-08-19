import { INTERNAL_VAR_NAME as m } from '../constants';
import emitHook from './emitHook';

export default function emitMount(component) {
  let children = component[m].children;
  Object.keys(children).forEach(key => emitMount(children[key]));

  component[m].mounted = true;
  emitHook(component, 'didMount');
}
