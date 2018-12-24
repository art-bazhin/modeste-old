import VNode from './VNode';

export default function createComponentNode(name, opts) {
  return new VNode('component', name, opts);
}
