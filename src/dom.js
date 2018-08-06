import { getScopeRoot, toKebabCase } from './utils';
import JustError from './error';

export function createDom(vDom, parent, isComponentRoot) {
  if (!vDom) {
    return document.createComment('');
  }

  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      prepareVDom(vDom, parent._justInternal.scope, isComponentRoot);

      if (vDom.component) {
        let component = createComponent(vDom.component, vDom.props, parent);

        if (vDom.ref) vDom.ref(component);

        component.render();
        return component._justInternal.dom;
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

      vDom.children.forEach(child => {
        testVDom(child, parent);
        dom.appendChild(createDom(child, parent));
      });

      if (vDom.ref) vDom.ref(dom);

      return dom;
  }
}

export function updateDom(dom, vDom, parent, isComponentRoot) {
  prepareVDom(vDom, parent._justInternal.scope, isComponentRoot);

  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom._justId) {
      parent._justInternal.removeChild(dom._justId);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent._justInternal.dom === dom) {
      parent._justInternal.dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case 1:
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
        testVDom(child, parent);

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

      // Run ref function
      if (vDom.ref) vDom.ref(dom);

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
    let component = parent._justInternal.children[id];

    if (!vDom.props) vDom.props = {};

    if (component._justInternal.name === vDom.component) {
      component._justInternal.dom = dom;
      component._justInternal.setProps(vDom.props);
      if (vDom.ref) vDom.ref(component);
      return;
    } else parent._justInternal.removeChild(id);
  }

  let component = createComponent(vDom.component, vDom.props, parent);
  component._justInternal.dom = dom;

  if (vDom.ref) vDom.ref(component);

  component.render();
}

function createComponent(name, props, parent) {
  if (parent._justInternal.factories[name]) {
    return parent._justInternal.factories[name](props, parent);
  }

  return parent._justInternal.app.factories[name](props, parent);
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
  if (!vDom || typeof vDom === 'string') return;
  if (!vDom.children) vDom.children = [];
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

function testVDom(vDom, parent) {
  if (!vDom) return;

  if (typeof vDom !== 'string' && !vDom.tag && !vDom.component) {
    throw new JustError(
      `${
        parent._justInternal.name
      }: VDOM node must be a string or an object with "tag" or "component" property`
    );
  }

  if (vDom.children && !(vDom.children instanceof Array)) {
    throw new JustError(
      `${
        parent._justInternal.name
      }: VDOM node "children" property must be an Array`
    );
  }
}
