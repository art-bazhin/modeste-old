import generateId from '../utils/generateId';

export default function generateScope(name) {
  return generateId(id => `${name}_${id}`);
}
