export function createDom(vDom, prefix) {
  switch (typeof vDom) {
    case 'string':
      return document.createTextNode(vDom);

    case 'object':
      let element = document.createElement(vDom.tag);

      if (vDom.props) {
        if (vDom.props.className) {
          vDom.props.className = getPrefixedClassString(
            vDom.props.className,
            prefix
          );
        }

        element._justProps = {};

        Object.keys(vDom.props).forEach(prop => {
          if (vDom.props[prop] !== null) {
            element[prop] = vDom.props[prop];
            element._justProps[prop] = vDom.props[prop];
          }
        });
      }

      if (!(vDom.children instanceof Array)) vDom.children = [];
      vDom.children = vDom.children.filter(elem => elem !== null);
      vDom.children.forEach(child =>
        element.appendChild(createDom(child, prefix))
      );

      return element;
  }
}

export function updateDom(dom, vDom, prefix) {
  switch (dom.nodeType) {
    case 1:
      let props = [];
      Object.keys(dom._justProps).forEach(prop => {
        props.push(prop);
      });

      if (vDom.props) {
        if (vDom.props.className) {
          vDom.props.className = getPrefixedClassString(
            vDom.props.className,
            prefix
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

      if (!(vDom.children instanceof Array)) vDom.children = [];
      vDom.children = vDom.children.filter(elem => elem !== null);

      vDom.children.forEach((child, index) => {
        if (!dom.childNodes[index]) {
          dom.appendChild(createDom(child, prefix));
        } else if (sameType(dom.childNodes[index], child)) {
          updateDom(dom.childNodes[index], child, prefix);
        } else {
          dom.replaceChild(createDom(child, prefix), dom.childNodes[index]);
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

function sameType(dom, vDom) {
  return (
    (typeof vDom === 'object' && dom.nodeType === 1) ||
    (typeof vDom === 'string' && dom.nodeType === 3)
  );
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
