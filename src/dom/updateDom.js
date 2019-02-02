import { INTERNAL_VAR_NAME as m, ELEMENT_NODE, TEXT_NODE } from '../constants';
import sameTypeAndTag from './sameTypeAndTag';
import updateComponentDom from './updateComponentDom';
import createDom from './createDom';
import removeComponent from '../component/removeComponent';
import emitMount from '../component/emitMount';
import isNullOrUndefined from '../utils/isNullOrUndefined';
import getScopedClassString from '../utils/getScopedClassString';
import getRootClass from '../component/getRootClass';

export default function updateDom(dom, vNode, parentComponent, isRoot) {
  if (!dom[m]) dom[m] = {};

  if (vNode && vNode.type === 'component') {
    updateComponentDom(dom, vNode, parentComponent);
    return;
  }

  if (!sameTypeAndTag(dom, vNode)) {
    let newDom = createDom(vNode, parentComponent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parentComponent && parentComponent[m].dom === dom) {
      parentComponent[m].dom = newDom;
    } else if (dom[m] && dom[m].id) {
      removeComponent(parentComponent[m].children[dom[m].id]);
    }

    return;
  }

  switch (dom.nodeType) {
    case ELEMENT_NODE:
      let rootClass = isRoot ? getRootClass(parentComponent) : '';
      if (rootClass) rootClass = ' ' + rootClass;

      // Process attrs
      let attrs = dom[m].attrs ? Object.keys(dom[m].attrs) : [];
      dom[m].attrs = dom[m].attrs || {};

      Object.keys(vNode.attrs).forEach(attr => {
        if (isNullOrUndefined(vNode.attrs[attr])) {
          dom.removeAttribute(attr);
          delete dom[m].attrs[attr];
        } else if (dom[m].attrs[attr] !== vNode.attrs[attr]) {
          dom[m].attrs[attr] = vNode.attrs[attr];

          if (parentComponent && attr === 'class') {
            dom.setAttribute(
              attr,
              getScopedClassString(vNode.attrs[attr], parentComponent.scope) +
                rootClass
            );
          } else {
            dom.setAttribute(attr, vNode.attrs[attr]);
          }
        }

        let index = attrs.indexOf(attr);
        if (index > -1) {
          attrs.splice(index, 1);
        }
      });

      attrs.forEach(attr => {
        dom.removeAttribute(attr);
        delete dom[m].attrs[attr];
      });

      // Process props
      let props = dom[m].props ? Object.keys(dom[m].props) : [];
      dom[m].props = dom[m].props || {};

      Object.keys(vNode.props).forEach(prop => {
        if (isNullOrUndefined(vNode.props[prop])) {
          dom[prop] = null;
          delete dom[m].props[prop];
        } else if (dom[m].props[prop] !== vNode.props[prop]) {
          dom[m].props[prop] = vNode.props[prop];

          if (parentComponent && prop === 'className') {
            dom[prop] =
              getScopedClassString(
                vNode.props[prop],
                parentComponent[m].scope
              ) + rootClass;
          } else {
            dom[prop] = vNode.props[prop];
          }
        }

        let index = props.indexOf(prop);
        if (index > -1) {
          props.splice(index, 1);
        }
      });

      props.forEach(prop => {
        dom[prop] = null;
        delete dom[m].props[prop];
      });

      // Process child nodes
      let keyed =
        vNode.children[0] &&
        vNode.children[0].props &&
        vNode.children[0].props.$key !== undefined;

      if (keyed) {
        let nodes = {};
        let vNodes = {};

        vNode.children.forEach(child => {
          vNodes[child.props.$key] = child;
        });

        while (dom.firstChild) {
          nodes[dom.firstChild[m].key] = dom.removeChild(dom.firstChild);
        }

        vNode.children.forEach(child => {
          if (nodes[child.props.$key]) {
            dom.appendChild(nodes[child.props.$key]);
            updateDom(nodes[child.props.$key], child, parentComponent);
          } else {
            appendNewDomAndMount(child, dom, parentComponent);
          }
        });
      } else {
        vNode.children.forEach((child, index) => {
          if (!dom.childNodes[index]) {
            appendNewDomAndMount(child, dom, parentComponent);
          } else {
            updateDom(dom.childNodes[index], child, parentComponent);
          }
        });

        while (dom.childNodes[vNode.children.length]) {
          let child = dom.childNodes[vNode.children.length];
          dom.removeChild(child);
        }
      }

      // Run ref function
      if (vNode.props.$ref) vNode.props.$ref(dom);

      // Store the key
      if (vNode.props.$key) dom[m].key = vNode.props.$key;
      else if (dom[m].key) delete dom[m].key;

      break;

    case TEXT_NODE:
      if (dom.nodeValue !== vNode) {
        dom.nodeValue = vNode;
      }
      break;
  }
}

function appendNewDomAndMount(vNode, parentDom, parentComponent) {
  let childDom = createDom(vNode, parentComponent);
  parentDom.appendChild(childDom);

  if (
    parentComponent &&
    parentComponent[m].mounted &&
    childDom[m] &&
    childDom[m].id
  ) {
    emitMount(parentComponent[m].children[childDom[m].id]);
  }
}
