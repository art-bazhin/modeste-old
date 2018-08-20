import generateId from '../utils/generateId';

const scopes = {};

export default function generateScope(name) {
  return generateId(scopes, id => `__${name}_${id}__`);
}
