import { getScopeRoot, toKebabCase } from './utils';
import modesteError from './error';
import { INTERNAL_VAR_NAME as m } from './constants';

export function createDom(vDom, parent, isComponentRoot) {
  if (!vDom) {
    return document.createComment('');
  }

  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      prepareVDom(vDom, parent[m].scope, isComponentRoot);

      if (vDom.component) {
        let component = createComponent(vDom.component, vDom.props, parent);

        if (vDom.ref) vDom.ref(component);

        component.render();
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
        testVDom(child, parent);
        dom.appendChild(createDom(child, parent));
      });

      if (vDom.ref) vDom.ref(dom);

      return dom;
  }
}

export function updateDom(dom, vDom, parent, isComponentRoot) {
  prepareVDom(vDom, parent[m].scope, isComponentRoot);

  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom[m] && dom[m].id) {
      parent[m].removeChild(dom[m].id);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent[m].dom === dom) {
      parent[m].dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case 1:
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
        } else if (dom[attr] !== vDom.attrs[attr]) {
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
        } else if (dom[prop] !== vDom.props[prop]) {
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
  if (dom[m].id) {
    let id = dom[m].id;
    let component = parent[m].children[id];

    if (!vDom.props) vDom.props = {};

    if (component[m].name === vDom.component) {
      component[m].dom = dom;
      component[m].setProps(vDom.props);
      if (vDom.ref) vDom.ref(component);
      return;
    } else parent[m].removeChild(id);
  }

  let component = createComponent(vDom.component, vDom.props, parent);
  component[m].dom = dom;

  if (vDom.ref) vDom.ref(component);

  component.render();
}

function createComponent(name, props, parent) {
  if (parent[m].factories[name]) {
    return parent[m].factories[name](props, parent);
  }

  return parent[m].app.factories[name](props, parent);
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

    let scopeClass = isComponentRoot ? getScopeRoot(scope) : scope;

    if (vDom.props.className) {
      delete vDom.attrs.class;
      vDom.props.className = scopeClass + ' ' + vDom.props.className;
    } else {
      if (!vDom.attrs.class) vDom.props.className = scopeClass;
      else vDom.attrs.class = scopeClass + ' ' + vDom.attrs.class;
    }
  }
}

function testVDom(vDom, parent) {
  if (!vDom) return;

  if (typeof vDom !== 'string' && !vDom.tag && !vDom.component) {
    throw new modesteError(
      `${
        parent[m].name
      }: VDOM node must be a string or an object with "tag" or "component" property`
    );
  }

  if (vDom.children && !(vDom.children instanceof Array)) {
    throw new modesteError(
      `${parent[m].name}: VDOM node "children" property must be an Array`
    );
  }
}
