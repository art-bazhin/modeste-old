import { INTERNAL_VAR_NAME as m, CORE_PROPS } from '../constants';
import throwError from '../utils/throwError';

function validatePropType(
  prop,
  type,
  key,
  component,
  isFirstCheck,
  throwErrors = true
) {
  if (key[0] === '$') {
    throwError('prop names starting with "$" are reserved', component);
  }

  if (prop === null || type === 'any') return true;

  if (type instanceof Array) {
    let answer = false;

    type.forEach(t => {
      answer =
        answer || validatePropType(prop, t, key, component, false, false);
    });

    if (!answer) {
      throwError(`${key} prop type must be one of ${type}`, component);
    }

    return true;
  }

  switch (typeof type) {
    case 'string':
      if (prop === undefined) return true;
      if (typeof prop !== type) {
        if (throwErrors)
          throwError(`"${key}" prop must be a type "${type}"`, component);
        return false;
      }
      break;
    case 'function':
      if (prop === undefined) return true;
      if (!(prop instanceof type)) {
        if (throwErrors)
          throwError(`prop must be an instance of ${type.name}`, component);
        return false;
      }
      break;
    default:
      if (isFirstCheck) return validatePropObject(prop, type, key, component);
      throwError(`wrong "${key}" prop type description`, component);
  }

  return true;
}

function validatePropObject(prop, obj, key, component) {
  validatePropType(prop, obj.type, key, component);

  if (obj.required && prop === undefined) {
    throwError(`"${key}" is required property of the component`, component);
  }

  if (obj.validator && !obj.validator(prop)) {
    throwError(`"${key}" prop hasn't been passed custom validation`, component);
  }

  return true;
}

export default function validateProps(props, validationObject, component) {
  let keys = Object.keys(props).filter(key => CORE_PROPS.indexOf(key) < 0);
  if (!keys.length && !validationObject) return true;

  if (!validationObject) {
    throwError("component doesn't have any declared props", component);
  }

  let validationKeys = Object.keys(validationObject);
  let propKeys = Object.keys(props);

  propKeys.forEach(key => {
    if (key[0] !== '$' && validationKeys.indexOf(key) < 0) {
      throwError(`"${key}" is not acceptable component property`, component);
    }
  });

  validationKeys.forEach(key => {
    validatePropType(props[key], validationObject[key], key, component, true);
  });

  return true;
}
