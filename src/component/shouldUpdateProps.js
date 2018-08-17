import shallowCompare from '../utils/shallowCompare';

export default function shouldUpdateProps(oldProps, newProps) {
  !shallowCompare(oldProps, newProps);
}
