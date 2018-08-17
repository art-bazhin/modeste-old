import { COMMENT_NODE, ELEMENT_NODE, TEXT_NODE } from '../constants';

export default function sameTypeAndTag(dom, vDom) {
  if (!vDom) return dom.nodeType === COMMENT_NODE;

  if (typeof vDom === 'object' && dom.nodeType === ELEMENT_NODE) {
    return vDom.tag.toUpperCase() === dom.tagName;
  } else if (typeof vDom === 'string' && dom.nodeType === TEXT_NODE) {
    return true;
  }

  return false;
}
