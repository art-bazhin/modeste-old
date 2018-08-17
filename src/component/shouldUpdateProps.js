import shallowCompare from '../utils/shallowCompare';

export default function shouldUpdateProps(oldProps, newProps) {
  return !shallowCompare(oldProps, newProps);
}
