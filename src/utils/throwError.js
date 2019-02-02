import { INTERNAL_VAR_NAME as m } from '../constants';
import ModesteError from './ModesteError';

export default function throwError(message, component) {
  console.log('%c\n----[MODESTE ERROR]----', 'color: red');
  console.log('Message: ' + message);

  if (component) {
    console.log('Component: ' + component[m].name);
    console.log(component);

    if (component[m].dom) {
      console.log('DOM:');
      console.log(component[m].dom);
    }
  }

  console.log('%c-----------------------\n', 'color: red');
  throw new ModesteError(message);
}
