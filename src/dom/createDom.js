import { INTERNAL_VAR_NAME as m } from '../constants';
import createComponent from '../component/createComponent';
import render from '../component/render';
import emitMount from '../component/emitMount';
import getScopedClassString from '../utils/getScopedClassString';

export default function createDom(vNode, parent) {
  if (!vNode) {
    return document.createComment('');
  }

  switch (typeof vNode) {
    case 'string':
      return document.createTextNode(vNode);

    default:
      if (vNode.type === 'component') {
        let component = createComponent(vNode.name, vNode.props, parent);

        if (vNode.core.ref) vNode.core.ref(component);

        render(component);

        if (vNode.core.key !== undefined) {
          component[m].dom[m].key = vNode.core.key;
        }
        return component[m].dom;
      }

      let dom = document.createElement(vNode.name);

      dom[m] = {};
      dom[m].attrs = {};
      dom[m].props = {};

      Object.keys(vNode.attrs).forEach(attr => {
        if (vNode.attrs[attr] !== null) {
          dom[m].attrs[attr] = vNode.attrs[attr];

          if (parent && attr === 'class') {
            dom.setAttribute(
              attr,
              getScopedClassString(vNode.attrs[attr], parent.scope)
            );
          } else {
            dom.setAttribute(attr, vNode.attrs[attr]);
          }
        }
      });

      Object.keys(vNode.props).forEach(prop => {
        if (vNode.props[prop] !== null) {
          dom[m].props[prop] = vNode.props[prop];

          if (parent && prop === 'className') {
            dom[prop] = getScopedClassString(
              vNode.props[prop],
              parent[m].scope
            );
          } else {
            dom[prop] = vNode.props[prop];
          }
        }
      });

      vNode.children.forEach(child => {
        let childDom = createDom(child, parent);
        dom.appendChild(childDom);

        if (parent && parent[m].mounted && childDom[m] && childDom[m].id) {
          emitMount(parent[m].children[childDom[m].id]);
        }
      });

      if (vNode.core.ref) vNode.core.ref(dom);
      if (vNode.core.key !== undefined) dom[m].key = vNode.core.key;

      return dom;
  }
}
