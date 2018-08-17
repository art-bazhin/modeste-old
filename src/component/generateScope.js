import generateId from '../utils/generateId';

const scopes = {};

export default function generateScope(name) {
  return generateId(1000000, scopes, id => name + id);
}
