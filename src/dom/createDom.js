import { INTERNAL_VAR_NAME as m } from '../constants';
import addClass from '../vDom/addClass';
import createComponent from '../component/createComponent';
import render from '../component/render';
import emitMount from '../component/emitMount';

export default function createDom(vNode, parent) {
  if (parent) addClass(vNode, parent[m].scope);

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
          dom.setAttribute(attr, vNode.attrs[attr]);
          dom[m].attrs[attr] = vNode.attrs[attr];
        }
      });

      Object.keys(vNode.props).forEach(prop => {
        if (vNode.props[prop] !== null) {
          dom[prop] = vNode.props[prop];
          dom[m].props[prop] = vNode.props[prop];
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
