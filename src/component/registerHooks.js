import { INTERNAL_VAR_NAME as m, HOOKS } from '../constants';

export default function registerHooks(component, manifest) {
  HOOKS.forEach(hook => {
    if (manifest[hook]) component[m][hook] = manifest[hook].bind(component);
  });
}
