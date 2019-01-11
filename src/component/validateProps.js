import { INTERNAL_VAR_NAME as m } from '../constants';
import ModesteError from '../utils/ModesteError';

function validatePropType(prop, type, key, component, isFirstCheck) {
  if (prop === null || type === 'any') return true;

  switch (typeof type) {
    case 'string':
      if (prop === undefined) return true;
      if (typeof prop !== type) {
        throw new ModesteError(
          `${component[m].name}: ${key} prop must be a type ${type}`
        );
      }
      break;
    case 'function':
      if (prop === undefined) return true;
      if (!(prop instanceof type)) {
        throw new ModesteError(
          `${component[m].name}: ${key} prop must be an instance of ${
            type.name
          }`
        );
      }
      break;
    default:
      if (isFirstCheck) return validatePropObject(prop, type, key, component);
      throw new ModesteError(
        `${component[m].name}: wrong ${key} prop type description`
      );
  }

  return true;
}

function validatePropObject(prop, obj, key, component) {
  validatePropType(prop, obj.type, key, component);

  if (obj.required && prop === undefined) {
    throw new ModesteError(
      `${component[m].name}: ${key} is required property of the component`
    );
  }

  if (obj.validator && !obj.validator(prop)) {
    throw new ModesteError(
      `${component[m].name}: ${key} prop didn't pass custom validation`
    );
  }

  return true;
}

export default function validateProps(props, validationObject, component) {
  if (!Object.keys(props).length && !validationObject) return true;

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
    validatePropType(props[key], validationObject[key], key, component, true);
  });

  return true;
}
