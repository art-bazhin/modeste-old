const ROOT_NAME = 'modesteRoot';
const INTERNAL_VAR_NAME = '__modesteInternal';

const COMMENT_NODE = window.Node.COMMENT_NODE;
const ELEMENT_NODE = window.Node.ELEMENT_NODE;
const TEXT_NODE = window.Node.TEXT_NODE;

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
  return !shallowCompare(oldProps, newProps);
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

  if (scope) {
    let regex = /:\$/gm;
    let repl = '.' + scope;

    styleElement.textContent = style.replace(regex, repl);
  } else {
    styleElement.textContent = style;
  }

  document.head.appendChild(styleElement);

  return styleElement;
}

function registerComponent(parent, name, manifest) {
  if (!parent[INTERNAL_VAR_NAME].factories[name]) {
    let scope = manifest.scope !== false ? generateScope(name) : false;

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
        parent
      );

      parent[INTERNAL_VAR_NAME].children[id] = component;

      return component;
    };
  }
}

function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

function tag(tag, opts, children) {
  let props = {};
  let attrs = {};

  let node = { tag, props, attrs };

  if (opts) {
    if (opts instanceof Array) {
      children = opts;
    } else {
      Object.keys(opts).forEach(key => {
        switch (key[0]) {
          case '_':
            attrs[toKebabCase(key.substr(1))] = opts[key];
            break;
          case '$':
            node[key.substr(1)] = opts[key];
            break;
          default:
            props[key] = opts[key];
        }
      });
    }
  }

  node.children = children ? children : [];

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

function addClass(vDom, className) {
  if (!vDom || typeof vDom === 'string' || !className) return;
  if (!vDom.component) {
    if (!vDom.props.className) vDom.props.className = '';
    if (!vDom.attrs.class) vDom.attrs.class = '';

    vDom.props.className = `${vDom.props.className} ${className}`.trim();
    vDom.attrs.class = `${vDom.attrs.class} ${className}`.trim();
  }
}

function createComponent(name, props, parent) {
  if (parent[INTERNAL_VAR_NAME].factories[name]) {
    return parent[INTERNAL_VAR_NAME].factories[name](props, parent);
  }

  return parent[INTERNAL_VAR_NAME].app.factories[name](props, parent);
}

function emitMount(component) {
  let children = component[INTERNAL_VAR_NAME].children;
  Object.keys(children).forEach(key => emitMount(children[key]));

  component[INTERNAL_VAR_NAME].mounted = true;
  emitHook(component, 'didMount');
}

function createDom(vDom, parent) {
  addClass(vDom, parent[INTERNAL_VAR_NAME].scope);

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
        let childDom = createDom(child, parent);
        dom.appendChild(childDom);

        if (parent[INTERNAL_VAR_NAME].mounted && childDom[INTERNAL_VAR_NAME] && childDom[INTERNAL_VAR_NAME].id) {
          emitMount(parent[INTERNAL_VAR_NAME].children[childDom[INTERNAL_VAR_NAME].id]);
        }
      });

      if (vDom.ref) vDom.ref(dom);

      return dom;
  }
}

function sameTypeAndTag(dom, vDom) {
  if (!vDom) return dom.nodeType === COMMENT_NODE;

  if (typeof vDom === 'object' && dom.nodeType === ELEMENT_NODE) {
    return vDom.tag.toUpperCase() === dom.tagName;
  } else if (typeof vDom === 'string' && dom.nodeType === TEXT_NODE) {
    return true;
  }

  return false;
}

function setProps(component, props) {
  if (component[INTERNAL_VAR_NAME].shouldUpdateProps(component.props, props)) {
    component[INTERNAL_VAR_NAME].props = props;
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

  render(component);

  if (parent[INTERNAL_VAR_NAME].mounted) emitMount(component);
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
  addClass(vDom, parent[INTERNAL_VAR_NAME].scope);

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
    case ELEMENT_NODE:
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
        } else if (dom[INTERNAL_VAR_NAME].attrs[attr] !== vDom.attrs[attr]) {
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
        } else if (dom[INTERNAL_VAR_NAME].props[prop] !== vDom.props[prop]) {
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
          let childDom = createDom(child, parent);
          dom.appendChild(childDom);

          if (parent[INTERNAL_VAR_NAME].mounted && childDom[INTERNAL_VAR_NAME] && childDom[INTERNAL_VAR_NAME].id) {
            emitMount(parent[INTERNAL_VAR_NAME].children[childDom[INTERNAL_VAR_NAME].id]);
          }
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

    case TEXT_NODE:
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

function render(component$$1) {
  const mounting = !component$$1[INTERNAL_VAR_NAME].dom;

  if (mounting) emitHook(component$$1, 'willMount');
  else emitHook(component$$1, 'willUpdate');

  let vDom = component$$1[INTERNAL_VAR_NAME].render(tag, component);

  if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
    throw new ModesteError(
      `${component$$1[INTERNAL_VAR_NAME].name}: Component root must be a tag`
    );
  }

  if (mounting) {
    component$$1[INTERNAL_VAR_NAME].dom = createDom(vDom, component$$1, true);
  } else {
    updateDom(component$$1[INTERNAL_VAR_NAME].dom, vDom, component$$1, true);
  }

  component$$1[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].id = component$$1[INTERNAL_VAR_NAME].id;

  if (!mounting) emitHook(component$$1, 'didUpdate');
}

class Component {
  constructor(opts, parent) {
    this[INTERNAL_VAR_NAME] = {};

    if (!opts.manifest.factories) opts.manifest.factories = {};

    this[INTERNAL_VAR_NAME].factories = opts.manifest.factories;
    this[INTERNAL_VAR_NAME].parent = parent;
    this[INTERNAL_VAR_NAME].app = parent ? parent[INTERNAL_VAR_NAME].app : this;
    this[INTERNAL_VAR_NAME].name = opts.name;
    this[INTERNAL_VAR_NAME].id = opts.id;
    this[INTERNAL_VAR_NAME].scope = opts.scope;
    this[INTERNAL_VAR_NAME].children = {};
    this[INTERNAL_VAR_NAME].props = opts.props ? opts.props : {};

    this[INTERNAL_VAR_NAME].render = opts.manifest.render.bind(this);
    this[INTERNAL_VAR_NAME].shouldUpdateData = shouldUpdateData;
    this[INTERNAL_VAR_NAME].shouldUpdateProps = shouldUpdateProps;

    registerHooks(this, opts.manifest);
    emitHook(this, 'willCreate');

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
              render(this);
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
    render(this);
  }

  get props() {
    return this[INTERNAL_VAR_NAME].props;
  }
}

let scope = generateScope(ROOT_NAME);

class Modeste extends Component {
  constructor(manifest, props) {
    super({
      name: ROOT_NAME,
      id: ROOT_NAME,
      manifest,
      props,
      scope
    });

    if (manifest.style) addStyles(manifest.style(), scope);
    this[INTERNAL_VAR_NAME].wrap = manifest.selector
      ? document.querySelector(manifest.selector)
      : null;
  }

  render() {
    super.render();

    if (!this[INTERNAL_VAR_NAME].mounted && !this[INTERNAL_VAR_NAME].wrap) return emitMount(this);

    if (this[INTERNAL_VAR_NAME].wrap && this[INTERNAL_VAR_NAME].wrap.childNodes.length === 0) {
      this[INTERNAL_VAR_NAME].wrap.appendChild(this[INTERNAL_VAR_NAME].dom);
      emitMount(this);
    }
  }

  get $dom() {
    return this[INTERNAL_VAR_NAME].dom;
  }
}

export default Modeste;
