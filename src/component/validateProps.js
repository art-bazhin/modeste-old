import { INTERNAL_VAR_NAME as m } from '../constants';
import ModesteError from '../utils/ModesteError';

export default function validateProps(props, validationObject, component) {
  let validationKeys = Object.keys(validationObject);
  let propKeys = Object.keys(props);

  propKeys.forEach(key => {
    if (validationKeys.indexOf(key) < 0) {
      throw new ModesteError(
        `${component[m].name}: ${key} is not acceptable component property`
      );
    }
  });

  validationKeys.forEach(key => {
    if (validationObject[key] && propKeys.indexOf(key) < 0) {
      throw new ModesteError(
        `${component[m].name}: ${key} is required property of the component`
      );
    }
  });

  return true;
}
