import { COMMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../constants';

export default function sameTypeAndTag(dom, vNode) {
  if (!vNode) return dom.nodeType === COMMENT_NODE;

  if (typeof vNode === 'object' && dom.nodeType === ELEMENT_NODE) {
    return vNode.name.toUpperCase() === dom.tagName;
  } else if (typeof vNode === 'string' && dom.nodeType === TEXT_NODE) {
    return true;
  }

  return false;
}
