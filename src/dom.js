export function createDom(vDom, parent) {
  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      if (vDom.component) {
        let component = new parent.components[vDom.component]();
        parent.componentPool.push(component);
        component.render();
        return component.dom;
      }

      let dom = document.createElement(vDom.tag);

      if (vDom.props) {
        if (vDom.props.className) {
          vDom.props.className = getPrefixedClassString(
            vDom.props.className,
            parent.prefix
          );
        }

        dom._justProps = {};

        Object.keys(vDom.props).forEach(prop => {
          if (vDom.props[prop] !== null) {
            dom[prop] = vDom.props[prop];
            dom._justProps[prop] = vDom.props[prop];
          }
        });
      }

      createCustomAttrs(dom, vDom, 'data', 'data-');
      createCustomAttrs(dom, vDom, 'aria', 'aria-');

      if (!(vDom.children instanceof Array)) vDom.children = [];
      vDom.children = vDom.children.filter(elem => elem !== null);
      vDom.children.forEach(child => dom.appendChild(createDom(child, parent)));

      return dom;
  }
}

export function updateDom(dom, vDom, parent) {
  if (!sameTypeAndTag(dom, vDom)) {
    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent.dom === dom) {
      parent.dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case 1:
      let props = [];
      if (dom._justProps) {
        Object.keys(dom._justProps).forEach(prop => {
          props.push(prop);
        });
      }

      if (vDom.props) {
        if (vDom.props.className) {
          vDom.props.className = getPrefixedClassString(
            vDom.props.className,
            parent.prefix
          );
        }

        if (!dom._justProps) dom._justProps = {};

        Object.keys(vDom.props).forEach(prop => {
          if (vDom.props[prop] === null) {
            dom[prop] = null;
            delete dom._justProps[prop];
          } else if (dom._justProps[prop] !== vDom.props[prop]) {
            dom[prop] = vDom.props[prop];
            dom._justProps[prop] = vDom.props[prop];
          }

          let index = props.indexOf(prop);
          if (index > -1) {
            props.splice(index, 1);
          }
        });
      }

      props.forEach(prop => {
        dom[prop] = null;
        delete dom._justProps[prop];
      });

      let attrs = dom.getAttributeNames();
      updateCustomAttrs(dom, vDom, attrs, 'data', 'data-');
      updateCustomAttrs(dom, vDom, attrs, 'aria', 'aria-');

      if (!(vDom.children instanceof Array)) vDom.children = [];
      vDom.children = vDom.children.filter(elem => elem !== null);

      vDom.children.forEach((child, index) => {
        if (!dom.childNodes[index]) {
          dom.appendChild(createDom(child, parent));
        } else if (sameTypeAndTag(dom.childNodes[index], child)) {
          updateDom(dom.childNodes[index], child, parent);
        } else {
          dom.replaceChild(createDom(child, parent), dom.childNodes[index]);
        }
      });

      while (dom.childNodes[vDom.children.length]) {
        dom.removeChild(dom.childNodes[vDom.children.length]);
      }

      break;

    case 3:
      if (dom.nodeValue !== vDom) {
        dom.nodeValue = vDom;
      }
      break;
  }
}

function sameTypeAndTag(dom, vDom) {
  if (typeof vDom === 'object' && dom.nodeType === 1) {
    return vDom.tag.toUpperCase() === dom.tagName;
  } else if (typeof vDom === 'string' && dom.nodeType === 3) {
    return true;
  }

  return false;
}

function getPrefixedClassString(string, prefix) {
  let regex = /\s_/gm;
  let repl = ' ' + prefix;
  let className = string;

  if (className) {
    className = ' ' + className;
    className = className.replace(regex, repl);
    className = className.substr(1);
  }

  return className;
}

function updateCustomAttrs(dom, vDom, attrNames, vDomPropName, prefix) {
  let attrs = attrNames.filter(name => name.substr(0, 5) === prefix);

  if (vDom[vDomPropName]) {
    Object.keys(vDom[vDomPropName]).forEach(attr => {
      dom.setAttribute(prefix + attr, vDom[vDomPropName][attr]);

      let index = attrs.indexOf(prefix + attr);
      attrs.splice(index, 1);
    });
  }

  attrs.forEach(attr => dom.removeAttribute(attr));
}

function createCustomAttrs(dom, vDom, vDomPropName, prefix) {
  if (vDom[vDomPropName]) {
    Object.keys(vDom[vDomPropName]).forEach(attr => {
      dom.setAttribute(prefix + attr, vDom[vDomPropName][attr]);
    });
  }
}
