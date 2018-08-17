import { INTERNAL_VAR_NAME as m } from '../constants';

export default function emitHook(component, hook) {
  if (component[m][hook]) component[m][hook]();
}
