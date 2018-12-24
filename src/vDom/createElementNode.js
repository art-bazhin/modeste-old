import VNode from './VNode';

export default function createElementNode(name, opts, children) {
  if (opts instanceof Array) {
    children = opts;
    opts = undefined;
  }

  return new VNode('element', name, opts, children);
}
