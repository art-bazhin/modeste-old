import { INTERNAL_VAR_NAME as m } from '../constants';

const HOOKS = [
  'willCreate',
  'didCreate',
  'willMount',
  'didMount',
  'willRedraw',
  'didRedraw',
  'willRemove',
  'didRemove',
  'shouldUpdateData',
  'didUpdateData',
  'shouldUpdateProps',
  'didUpdateProps'
];

export default function registerHooks(component, manifest) {
  HOOKS.forEach(hook => {
    if (manifest[hook]) component[m][hook] = manifest[hook].bind(component);
  });
}
