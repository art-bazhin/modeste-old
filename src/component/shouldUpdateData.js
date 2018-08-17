import strictEqual from '../utils/strictEqual';

export default function shouldUpdateData(oldValue, newValue) {
  return !strictEqual(oldValue, newValue);
}
