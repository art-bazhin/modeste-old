const ROOT_NAME = 'modesteRoot';
const INTERNAL_VAR_NAME = '__modesteInternal';

function strictEqual(a, b) {
  return a === b;
}

function shouldUpdateData(oldValue, newValue) {
  return !strictEqual(oldValue, newValue);
}

function shallowCompare(a, b) {
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    let key = aKeys[i];
    let index = bKeys.indexOf(key);

    if (index < 0) return false;
    if (!strictEqual(a[key], b[key])) return false;
  }

  return true;
}

function shouldUpdateProps(oldProps, newProps) {
  !shallowCompare(oldProps, newProps);
}

const HOOKS = [
  'willCreate',
  'didCreate',
  'willMount',
  'didMount',
  'willUpdate',
  'didUpdate',
  'willRemove',
  'didRemove',
  'shouldUpdateData',
  'shouldUpdateProps'
];

function registerHooks(component, manifest) {
  HOOKS.forEach(hook => {
    if (manifest[hook]) component[INTERNAL_VAR_NAME][hook] = manifest[hook].bind(component);
  });
}

function emitHook(component, hook) {
  if (component[INTERNAL_VAR_NAME][hook]) component[INTERNAL_VAR_NAME][hook]();
}

function generateId(maxValue, store, middleware) {
  let id;

  do {
    id = (Math.random() * maxValue).toFixed(0);
    if (middleware) id = middleware(id);
  } while (store[id]);

  store[id] = true;

  return id;
}

const scopes = {};

function generateScope(name) {
  return generateId(1000000, scopes, id => `__${name}_${id}__`);
}

function addStyles(style, scope) {
  if (!style) return;

  let styleElement = document.createElement('style');

  let regex = /:\$/gm;
  let repl = '.' + scope;

  styleElement.textContent = style.replace(regex, repl);

  document.head.appendChild(styleElement);

  return styleElement;
}

function registerComponent(parent, name, manifest) {
  if (!parent[INTERNAL_VAR_NAME].factories[name]) {
    let scope = generateScope(name);

    addStyles(manifest.style(), scope);

    parent[INTERNAL_VAR_NAME].factories[name] = (props, parent) => {
      let id = generateId(1000000, parent[INTERNAL_VAR_NAME].children);

      let component = new Component(
        {
          name,
          manifest,
          scope,
          id,
          props
        },
        parent[INTERNAL_VAR_NAME].app
      );

      parent[INTERNAL_VAR_NAME].children[id] = component;

      return component;
    };
  }
}

function tag(tag, opts, children) {
  let props = {};
  let attrs = {};
  let node = { tag, props, attrs, children };

  if (opts) {
    Object.keys(opts).forEach(key => {
      switch (key[0]) {
        case '_':
          attrs[key.substr(1)] = opts[key];
          break;
        case '$':
          node[key.substr(1)] = opts[key];
          break;
        default:
          props[key] = opts[key];
      }
    });
  }

  return node;
}

function component(component, opts) {
  let props = {};
  let node = { component, props };

  if (opts) {
    Object.keys(opts).forEach(key => {
      switch (key[0]) {
        case '$':
          node[key.substr(1)] = opts[key];
          break;
        default:
          props[key] = opts[key];
      }
    });
  }

  return node;
}

function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function prepareVDom(vDom, scope) {
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

    if (vDom.props.className) {
      delete vDom.attrs.class;
      vDom.props.className = scope + ' ' + vDom.props.className;
    } else {
      if (!vDom.attrs.class) vDom.props.className = scope;
      else vDom.attrs.class = scope + ' ' + vDom.attrs.class;
    }
  }
}

function createComponent(name, props, parent) {
  if (parent[INTERNAL_VAR_NAME].factories[name]) {
    return parent[INTERNAL_VAR_NAME].factories[name](props, parent);
  }

  return parent[INTERNAL_VAR_NAME].app.factories[name](props, parent);
}

function createDom(vDom, parent) {
  prepareVDom(vDom, parent[INTERNAL_VAR_NAME].scope);

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

        render$1(component);
        return component[INTERNAL_VAR_NAME].dom;
      }

      let dom = document.createElement(vDom.tag);

      dom[INTERNAL_VAR_NAME] = {};
      dom[INTERNAL_VAR_NAME].attrs = {};
      dom[INTERNAL_VAR_NAME].props = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] !== null) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom[INTERNAL_VAR_NAME].attrs[attr] = vDom.attrs[attr];
        }
      });

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] !== null) {
          dom[prop] = vDom.props[prop];
          dom[INTERNAL_VAR_NAME].props[prop] = vDom.props[prop];
        }
      });

      vDom.children.forEach(child => {
        dom.appendChild(createDom(child, parent));
      });

      if (vDom.ref) vDom.ref(dom);

      return dom;
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

function setProps(component, props) {
  if (component[INTERNAL_VAR_NAME].shouldUpdateProps(component.props, props)) {
    component.props = props;
    render(component);
  }
}

function updateComponentDom(dom, vDom, parent) {
  if (dom[INTERNAL_VAR_NAME] && dom[INTERNAL_VAR_NAME].id) {
    let id = dom[INTERNAL_VAR_NAME].id;
    let component = parent[INTERNAL_VAR_NAME].children[id];

    if (!vDom.props) vDom.props = {};

    if (component[INTERNAL_VAR_NAME].name === vDom.component) {
      component[INTERNAL_VAR_NAME].dom = dom;
      setProps(component, vDom.props);

      if (vDom.ref) vDom.ref(component);
      return;
    } else parent[INTERNAL_VAR_NAME].removeChild(id);
  }

  let component = createComponent(vDom.component, vDom.props, parent);
  component[INTERNAL_VAR_NAME].dom = dom;

  if (vDom.ref) vDom.ref(component);

  render$1(component);
}

function removeChild(parent, id) {
  if (parent[INTERNAL_VAR_NAME].children[id]) {
    let component = parent[INTERNAL_VAR_NAME].children[id];

    emitHook(component, 'willRemove');
    delete component[INTERNAL_VAR_NAME].dom;

    Object.keys(component[INTERNAL_VAR_NAME].children).forEach(id => {
      removeChild(id, component);
    });

    emitHook(component, 'didRemove');
    delete parent[INTERNAL_VAR_NAME].children[id];
  }
}

function updateDom(dom, vDom, parent) {
  prepareVDom(vDom, parent[INTERNAL_VAR_NAME].scope);

  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom[INTERNAL_VAR_NAME] && dom[INTERNAL_VAR_NAME].id) {
      removeChild(parent, dom[INTERNAL_VAR_NAME].id);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent[INTERNAL_VAR_NAME].dom === dom) {
      parent[INTERNAL_VAR_NAME].dom = newDom;
    }

    return;
  }

  switch (dom.nodeType) {
    case 1:
      // Process attrs
      let attrs = [];

      if (dom[INTERNAL_VAR_NAME].attrs) {
        Object.keys(dom[INTERNAL_VAR_NAME].attrs).forEach(attr => {
          attrs.push(attr);
        });
      }

      if (!dom[INTERNAL_VAR_NAME].attrs) dom[INTERNAL_VAR_NAME].attrs = {};

      Object.keys(vDom.attrs).forEach(attr => {
        if (vDom.attrs[attr] === null) {
          dom.removeAttribute(attr);
          delete dom[INTERNAL_VAR_NAME].attrs[attr];
        } else if (dom[attr] !== vDom.attrs[attr]) {
          dom.setAttribute(attr, vDom.attrs[attr]);
          dom[INTERNAL_VAR_NAME].attrs[attr] = vDom.attrs[attr];
        }

        let index = attrs.indexOf(attr);
        if (index > -1) {
          attrs.splice(index, 1);
        }
      });

      attrs.forEach(attr => {
        dom.removeAttribute(attr);
        delete dom[INTERNAL_VAR_NAME].attrs[attr];
      });

      // Process props
      let props = [];

      if (dom[INTERNAL_VAR_NAME].props) {
        Object.keys(dom[INTERNAL_VAR_NAME].props).forEach(prop => {
          props.push(prop);
        });
      }

      if (!dom[INTERNAL_VAR_NAME].props) dom[INTERNAL_VAR_NAME].props = {};

      Object.keys(vDom.props).forEach(prop => {
        if (vDom.props[prop] === null) {
          dom[prop] = null;
          delete dom[INTERNAL_VAR_NAME].props[prop];
        } else if (dom[prop] !== vDom.props[prop]) {
          dom[prop] = vDom.props[prop];
          dom[INTERNAL_VAR_NAME].props[prop] = vDom.props[prop];
        }

        let index = props.indexOf(prop);
        if (index > -1) {
          props.splice(index, 1);
        }
      });

      props.forEach(prop => {
        dom[prop] = null;
        delete dom[INTERNAL_VAR_NAME].props[prop];
      });

      // Process child nodes
      if (!vDom.children) vDom.children = [];

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

class ModesteError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'MODESTE Error';
    this.message = '[MODESTE ERROR] ' + this.message;
    Error.captureStackTrace(this, modesteError);
  }
}

function render$1(component$$1) {
  let isMounting = !component$$1[INTERNAL_VAR_NAME].dom;

  if (isMounting) emitHook(component$$1, 'willMount');
  else emitHook(component$$1, 'willUpdate');

  let vDom = component$$1[INTERNAL_VAR_NAME].render(tag, component);

  if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
    throw new ModesteError(
      `${component$$1[INTERNAL_VAR_NAME].name}: Component root must be a tag`
    );
  }

  if (isMounting) {
    component$$1[INTERNAL_VAR_NAME].dom = createDom(vDom, component$$1, true);
  } else {
    updateDom(component$$1[INTERNAL_VAR_NAME].dom, vDom, component$$1, true);
  }

  component$$1[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].id = component$$1[INTERNAL_VAR_NAME].id;

  if (isMounting) emitHook(component$$1, 'didMount');
  else emitHook(component$$1, 'didUpdate');
}

class Component {
  constructor(opts, app) {
    this[INTERNAL_VAR_NAME] = {};

    if (!opts.manifest.factories) opts.manifest.factories = {};

    this[INTERNAL_VAR_NAME].factories = opts.manifest.factories;
    this[INTERNAL_VAR_NAME].app = app ? app : this;
    this[INTERNAL_VAR_NAME].name = opts.name;
    this[INTERNAL_VAR_NAME].id = opts.id;
    this[INTERNAL_VAR_NAME].scope = opts.scope;
    this[INTERNAL_VAR_NAME].children = {};

    this[INTERNAL_VAR_NAME].render = opts.manifest.render.bind(this);
    this[INTERNAL_VAR_NAME].shouldUpdateData = shouldUpdateData;
    this[INTERNAL_VAR_NAME].shouldUpdateProps = shouldUpdateProps;

    registerHooks(this, opts.manifest);
    emitHook(this, 'willCreate');

    this.props = opts.props ? opts.props : {};

    if (opts.manifest.data) {
      this[INTERNAL_VAR_NAME].data = opts.manifest.data();

      Object.keys(this[INTERNAL_VAR_NAME].data).forEach(prop =>
        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[INTERNAL_VAR_NAME].data[prop];
          },
          set: function(value) {
            if (this[INTERNAL_VAR_NAME].shouldUpdateData(this[INTERNAL_VAR_NAME].data[prop], value)) {
              this[INTERNAL_VAR_NAME].data[prop] = value;
              render$1(this);
            }
          }
        })
      );
    }

    if (opts.manifest.components) {
      Object.keys(opts.manifest.components).forEach(name => {
        registerComponent(this, name, opts.manifest.components[name]);
      });
    }

    if (opts.manifest.methods) {
      Object.keys(opts.manifest.methods).forEach(method => {
        this[method] = opts.manifest.methods[method].bind(this);
      });
    }

    emitHook(this, 'didCreate');
  }

  render() {
    render$1(this);
  }
}

let scope = generateScope(ROOT_NAME);

class Modeste extends Component {
  constructor(manifest) {
    super({
      name: ROOT_NAME,
      id: ROOT_NAME,
      manifest,
      scope
    });

    if (manifest.style) addStyles(manifest.style(), scope);
    this[INTERNAL_VAR_NAME].wrap = document.querySelector(manifest.selector);
  }

  render() {
    super.render();

    if (this[INTERNAL_VAR_NAME].wrap.childNodes.length === 0) {
      this[INTERNAL_VAR_NAME].wrap.appendChild(this[INTERNAL_VAR_NAME].dom);
    }
  }
}

export default Modeste;
