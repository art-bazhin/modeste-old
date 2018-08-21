import { INTERNAL_VAR_NAME as m, ELEMENT_NODE, TEXT_NODE } from '../constants';
import addClass from '../vDom/addClass';
import sameTypeAndTag from './sameTypeAndTag';
import updateComponentDom from './updateComponentDom';
import createDom from './createDom';
import removeChild from '../component/removeChild';
import emitMount from '../component/emitMount';

export default function updateDom(dom, vDom, parent) {
  addClass(vDom, parent[m].scope);

  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom[m] && dom[m].id) {
      removeChild(parent, dom[m].id);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent[m].dom === dom) {
      parent[m].dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case ELEMENT_NODE:
      // Process attrs
      let attrs = [];

      if (dom[m].attrs) {
        Object.keys(dom[m].attrs).forEach(attr => {
          attrs.push(attr);
        });
      }

      if (!dom[m].attrs) dom[m].attrs = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] === null) {
          dom.removeAttribute(attr);
          delete dom[m].attrs[attr];
        } else if (dom[m].attrs[attr] !== vDom.attrs[attr]) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom[m].attrs[attr] = vDom.attrs[attr];
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
      let props = [];

      if (dom[m].props) {
        Object.keys(dom[m].props).forEach(prop => {
          props.push(prop);
        });
      }

      if (!dom[m].props) dom[m].props = {};

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] === null) {
          dom[prop] = null;
          delete dom[m].props[prop];
        } else if (dom[m].props[prop] !== vDom.props[prop]) {
          dom[prop] = vDom.props[prop];
          dom[m].props[prop] = vDom.props[prop];
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
      let keyed = vDom.children[0] && vDom.children[0].key;

      if (keyed) {
        let nodes = {};

        dom.childNodes.forEach(child => {
          nodes[child[m].key] = child;
          dom.removeChild(child);
        });

        vDom.children.forEach(child => {
          if (nodes[child.key]) dom.appendChild(child);
          else dom.appendChild(createDom(child));
        });
      } else {
        vDom.children.forEach((child, index) => {
          if (!dom.childNodes[index]) {
            let childDom = createDom(child, parent);
            dom.appendChild(childDom);

            if (parent[m].mounted && childDom[m] && childDom[m].id) {
              emitMount(parent[m].children[childDom[m].id]);
            }
          } else {
            updateDom(dom.childNodes[index], child, parent);
          }
        });

        while (dom.childNodes[vDom.children.length]) {
          let child = dom.childNodes[vDom.children.length];
          dom.removeChild(child);
        }
      }

      // Run ref function
      if (vDom.ref) vDom.ref(dom);

      break;

    case TEXT_NODE:
      if (dom.nodeValue !== vDom) {
        dom.nodeValue = vDom;
      }
      break;
  }
}
