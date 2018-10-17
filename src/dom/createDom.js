import { INTERNAL_VAR_NAME as m } from '../constants';
import addClass from '../vDom/addClass';
import createComponent from '../component/createComponent';
import render from '../component/render';
import emitMount from '../component/emitMount';

export default function createDom(vDom, parent) {
  if (parent) addClass(vDom, parent[m].scope);

  if (!vDom) {
    return document.createComment('');
  }

  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      if (vDom.component) {
        let component = createComponent(vDom.component, vDom.props, parent);

        if (vDom.ref) vDom.ref(component);

        render(component);

        if (vDom.key !== undefined) {
          component[m].dom[m].key = vDom.key;
        }
        return component[m].dom;
      }

      let dom = document.createElement(vDom.tag);

      dom[m] = {};
      dom[m].attrs = {};
      dom[m].props = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] !== null) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom[m].attrs[attr] = vDom.attrs[attr];
        }
      });

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] !== null) {
          dom[prop] = vDom.props[prop];
          dom[m].props[prop] = vDom.props[prop];
        }
      });

      vDom.children.forEach(child => {
        let childDom = createDom(child, parent);
        dom.appendChild(childDom);

        if (parent && parent[m].mounted && childDom[m] && childDom[m].id) {
          emitMount(parent[m].children[childDom[m].id]);
        }
      });

      if (vDom.ref) vDom.ref(dom);
      if (vDom.key !== undefined) dom[m].key = vDom.key;

      return dom;
  }
}
