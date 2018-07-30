import { getScopeRoot, toKebabCase } from './utils';

export function createDom(vDom, parent, isComponentRoot) {
  if (!vDom) {
    return document.createComment('');
  }

  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      prepareVDom(vDom, parent.scope, isComponentRoot);

      if (vDom.component) {
        let component = parent.factories[vDom.component](vDom.props, parent);
        component.render();
        return component.dom;
      }

      let dom = document.createElement(vDom.tag);

      dom._justAttrs = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] !== null) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom._justAttrs[attr] = vDom.attrs[attr];
        }
      });

      dom._justProps = {};

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] !== null) {
          dom[prop] = vDom.props[prop];
          dom._justProps[prop] = vDom.props[prop];
        }
      });

      if (!(vDom.children instanceof Array)) vDom.children = [];
      vDom.children.forEach(child => dom.appendChild(createDom(child, parent)));

      return dom;
  }
}

export function updateDom(dom, vDom, parent, isComponentRoot) {
  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom._justId) {
      parent.removeComponent(dom._justId);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent.dom === dom) {
      parent.dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case 1:
      prepareVDom(vDom, parent.scope, isComponentRoot);

      // Process attrs
      let attrs = [];

      if (dom._justAttrs) {
        Object.keys(dom._justAttrs).forEach(attr => {
          attrs.push(attr);
        });
      }

      if (!dom._justAttrs) dom._justAttrs = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] === null) {
          dom.removeAttribute(attr);
          delete dom._justAttrs[attr];
        } else if (dom[attr] !== vDom.attrs[attr]) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom._justAttrs[attr] = vDom.attrs[attr];
        }

        let index = attrs.indexOf(attr);
        if (index > -1) {
          attrs.splice(index, 1);
        }
      });

      attrs.forEach(attr => {
        dom.removeAttribute(attr);
        delete dom._justAttrs[attr];
      });

      // Process props
      let props = [];

      if (dom._justProps) {
        Object.keys(dom._justProps).forEach(prop => {
          props.push(prop);
        });
      }

      if (!dom._justProps) dom._justProps = {};

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] === null) {
          dom[prop] = null;
          delete dom._justProps[prop];
        } else if (dom[prop] !== vDom.props[prop]) {
          dom[prop] = vDom.props[prop];
          dom._justProps[prop] = vDom.props[prop];
        }

        let index = props.indexOf(prop);
        if (index > -1) {
          props.splice(index, 1);
        }
      });

      props.forEach(prop => {
        dom[prop] = null;
        delete dom._justProps[prop];
      });

      // Process child nodes
      if (!(vDom.children instanceof Array)) vDom.children = [];

      vDom.children.forEach((child, index) => {
        if (!dom.childNodes[index]) {
          dom.appendChild(createDom(child, parent));
        } else {
          updateDom(dom.childNodes[index], child, parent);
        }
      });

      while (dom.childNodes[vDom.children.length]) {
        let child = dom.childNodes[vDom.children.length];
        dom.removeChild(child);
      }

      break;

    case 3:
      if (dom.nodeValue !== vDom) {
        dom.nodeValue = vDom;
      }
      break;
  }
}

function updateComponentDom(dom, vDom, parent) {
  if (dom._justId) {
    let id = dom._justId;
    let component = parent.components[id];

    if (!vDom.props) vDom.props = {};

    if (component.name === vDom.component) {
      component.dom = dom;
      component.props = vDom.props;
      component.render();
    } else {
      parent.removeComponent(id);
      component = parent.factories[vDom.component](vDom.props, parent);
      component.dom = dom;
      component.render();
    }
  } else {
    let component = parent.factories[vDom.component](vDom.props, parent);
    component.dom = dom;
    component.render();
  }
}

function sameTypeAndTag(dom, vDom) {
  if (!vDom) return dom.nodeType === 8;

  if (typeof vDom === 'object' && dom.nodeType === 1) {
    return vDom.tag.toUpperCase() === dom.tagName;
  } else if (typeof vDom === 'string' && dom.nodeType === 3) {
    return true;
  }

  return false;
}

function prepareVDom(vDom, scope, isComponentRoot) {
  if (!vDom.props) vDom.props = {};

  if (!vDom.component) {
    if (!vDom.attrs) vDom.attrs = {};
    else {
      let kebabAttrs = {};

      Object.keys(vDom.attrs).forEach(attr => {
        kebabAttrs[toKebabCase(attr)] = vDom.attrs[attr];
      });

      vDom.attrs = kebabAttrs;
    }

    if (vDom.attrs.class) delete vDom.attrs.class;

    let className = isComponentRoot ? getScopeRoot(scope) : scope;

    if (!vDom.props.className) vDom.props.className = className;
    else vDom.props.className = className + ' ' + vDom.props.className;
  }
}
