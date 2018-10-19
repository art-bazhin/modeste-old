import { INTERNAL_VAR_NAME as m } from '../constants';
import ModesteError from '../utils/ModesteError';

export default function validateProps(props, validationObject, component) {
  let validationKeys = Object.keys(validationObject);
  let propKeys = Object.keys(props);

  propKeys.forEach(propName => {
    if (validationKeys.indexOf(propName) < 0) {
      throw new ModesteError(
        `${component[m].name}: ${propName} is not acceptable component property`
      );
    }
  });

  validationKeys.forEach(propName => {
    if (validationKeys[propName] && propKeys.indexOf(propName) < 0) {
      throw new ModesteError(
        `${
          component[m].name
        }: ${propName} is required property of the component`
      );
    }
  });

  return true;
}
