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

      prepareVDom(vDom, parent.prefix);

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
      prepareVDom(vDom, parent.prefix);

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

function prepareVDom(vDom, className) {
  if (!vDom.attrs) vDom.attrs = {};
  if (!vDom.props) vDom.props = {};
  if (vDom.attrs.class) delete vDom.attrs.class;
  if (!vDom.props.className) vDom.props.className = className;
  else vDom.props.className = className + ' ' + vDom.props.className;
}
