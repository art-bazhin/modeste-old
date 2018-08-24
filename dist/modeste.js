const ROOT_NAME = 'modesteRoot';
const INTERNAL_VAR_NAME = '__modesteInternal';

const COMMENT_NODE = window.Node.COMMENT_NODE;
const ELEMENT_NODE = window.Node.ELEMENT_NODE;
const TEXT_NODE = window.Node.TEXT_NODE;

function shouldUpdateData(oldValue, newValue) {
  return oldValue !== newValue;
}

function shallowCompare(a, b) {
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    let key = aKeys[i];
    let index = bKeys.indexOf(key);

    if (index < 0) return false;
    if (a[key] !== b[key]) return false;
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

const ID_RND_LENGTH = 6;
let idCounter = 0;

function generateId(middleware) {
  let random = Math.random()
    .toString(36)
    .substr(2, ID_RND_LENGTH);

  let id =
    random +
    '0'.repeat(ID_RND_LENGTH - random.length) +
    (idCounter++).toString(36);

  if (middleware) return middleware(id);
  return id;
}

function generateScope(name) {
  return generateId(id => `${name}_${id}`);
}

function addStyles(style, scope) {
  if (!style) return;

  let styleElement = document.createElement('style');

  if (scope) {
    let regex = /:scoped([^\w\d])/gm;
    let repl = '.' + scope + '$1';

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

    if (manifest.style) addStyles(manifest.style(), scope);

    parent[INTERNAL_VAR_NAME].factories[name] = (props, parent) =>
      new Component(
        {
          name,
          manifest,
          scope,
          props
        },
        parent
      );
  }
}

function toKebabCase(str) {
  let kebab = str.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (kebab[0] === '-') return kebab.substr(1);
  return kebab;
}

function createTagNode(tag, opts, children) {
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

function createComponentNode(component, opts) {
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
  if (!vDom || typeof vDom === 'string' || vDom.component || !className) return;
  if (!vDom.props.className) vDom.props.className = '';
  if (!vDom.attrs.class) vDom.attrs.class = '';

  vDom.props.className = `${vDom.props.className} ${className}`.trim();
  vDom.attrs.class = `${vDom.attrs.class} ${className}`.trim();
}

function createComponent(name, props, parent) {
  if (parent[INTERNAL_VAR_NAME].factories[name]) {
    return parent[INTERNAL_VAR_NAME].factories[name](props, parent);
  }

  return parent[INTERNAL_VAR_NAME].app[INTERNAL_VAR_NAME].factories[name](props, parent);
}

function emitMount(component) {
  let children = component[INTERNAL_VAR_NAME].children;
  Object.keys(children).forEach(key => emitMount(children[key]));

  component[INTERNAL_VAR_NAME].mounted = true;
  emitHook(component, 'didMount');
}

function createDom(vDom, parent) {
  if (parent) addClass(vDom, parent[INTERNAL_VAR_NAME].scope);

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

        if (vDom.key) component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key = vDom.key;
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

        if (parent && parent[INTERNAL_VAR_NAME].mounted && childDom[INTERNAL_VAR_NAME] && childDom[INTERNAL_VAR_NAME].id) {
          emitMount(parent[INTERNAL_VAR_NAME].children[childDom[INTERNAL_VAR_NAME].id]);
        }
      });

      if (vDom.ref) vDom.ref(dom);
      if (vDom.key) dom[INTERNAL_VAR_NAME].key = vDom.key;

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

function assign() {
  for (let i = 1; i < arguments.length; i++) {
    Object.keys(arguments[i]).forEach(key => {
      arguments[0][key] = arguments[i][key];
    });
  }
  return arguments[0];
}

function setProps(component, props) {
  let newProps = component[INTERNAL_VAR_NAME].defaultProps
    ? assign({}, component[INTERNAL_VAR_NAME].defaultProps, props)
    : props;

  if (component[INTERNAL_VAR_NAME].shouldUpdateProps(component[INTERNAL_VAR_NAME].props, newProps)) {
    component[INTERNAL_VAR_NAME].props = newProps;
    render(component);
  }
}

function removeComponent(component) {
  emitHook(component, 'willRemove');

  let parent = component[INTERNAL_VAR_NAME].parent;
  let id = component[INTERNAL_VAR_NAME].id;

  Object.keys(component[INTERNAL_VAR_NAME].children).forEach(child => {
    removeComponent(child);
  });

  component[INTERNAL_VAR_NAME].subscriptions.forEach(item => {
    let store = item.store;
    item.fields.forEach(field => {
      if (store[INTERNAL_VAR_NAME].data.hasOwnProperty(field))
        delete store[INTERNAL_VAR_NAME].subscribers[field][id];
    });
  });

  component[INTERNAL_VAR_NAME].mounted = false;
  delete component[INTERNAL_VAR_NAME].dom;
  if (parent) delete parent[INTERNAL_VAR_NAME].children[id];

  emitHook(component, 'didRemove');
}

function updateComponentDom(dom, vDom, parent) {
  if (dom[INTERNAL_VAR_NAME] && dom[INTERNAL_VAR_NAME].id) {
    let id = dom[INTERNAL_VAR_NAME].id;
    let component = parent[INTERNAL_VAR_NAME].children[id];

    if (component[INTERNAL_VAR_NAME].name === vDom.component) {
      component[INTERNAL_VAR_NAME].dom = dom;
      setProps(component, vDom.props);

      if (vDom.ref) vDom.ref(component);

      if (vDom.key) component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key = vDom.key;
      else if (component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key) delete component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key;

      return;
    } else removeComponent(parent[INTERNAL_VAR_NAME].children[id]);
  }

  let component = createComponent(vDom.component, vDom.props, parent);
  component[INTERNAL_VAR_NAME].dom = dom;

  if (vDom.ref) vDom.ref(component);

  render(component);

  if (vDom.key) component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key = vDom.key;
  else if (component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key) delete component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].key;

  if (parent[INTERNAL_VAR_NAME].mounted) emitMount(component);
}

function updateDom(dom, vDom, parent) {
  if (vDom && vDom.component) {
    updateComponentDom(dom, vDom, parent);
    return;
  }

  if (!sameTypeAndTag(dom, vDom)) {
    if (dom[INTERNAL_VAR_NAME] && dom[INTERNAL_VAR_NAME].id) {
      removeComponent(parent[INTERNAL_VAR_NAME].children[dom[INTERNAL_VAR_NAME].id]);
    }

    let newDom = createDom(vDom, parent);
    dom.parentNode.replaceChild(newDom, dom);

    if (parent[INTERNAL_VAR_NAME].dom === dom) {
      parent[INTERNAL_VAR_NAME].dom = newDom;
    }

    return;
  }

  addClass(vDom, parent[INTERNAL_VAR_NAME].scope);

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
      let keyed = vDom.children[0] && vDom.children[0].key;

      if (keyed) {
        let nodes = {};
        let vNodes = {};

        vDom.children.forEach(child => {
          vNodes[child.key] = child;
        });

        while (dom.firstChild) {
          nodes[dom.firstChild[INTERNAL_VAR_NAME].key] = dom.removeChild(dom.firstChild);
        }

        vDom.children.forEach(child => {
          if (nodes[child.key]) {
            dom.appendChild(nodes[child.key]);
            updateDom(nodes[child.key], child, parent);
          } else dom.appendChild(createDom(child, parent));
        });
      } else {
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
      }

      // Run ref function
      if (vDom.ref) vDom.ref(dom);

      // Store the key
      if (vDom.key) dom[INTERNAL_VAR_NAME].key = vDom.key;
      else if (dom[INTERNAL_VAR_NAME].key) delete dom[INTERNAL_VAR_NAME].key;

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

function render(component) {
  if (component[INTERNAL_VAR_NAME].render) {
    if (!component[INTERNAL_VAR_NAME].mounted) emitHook(component, 'willMount');
    else emitHook(component, 'willUpdate');

    let vDom = component[INTERNAL_VAR_NAME].render(createTagNode, createComponentNode, component[INTERNAL_VAR_NAME].props);

    if (typeof vDom !== 'object' || vDom.component || !vDom.tag) {
      throw new ModesteError(
        `${component[INTERNAL_VAR_NAME].name}: Component root must be a tag`
      );
    }

    if (!component[INTERNAL_VAR_NAME].dom) {
      component[INTERNAL_VAR_NAME].dom = createDom(vDom, component);
    } else {
      updateDom(component[INTERNAL_VAR_NAME].dom, vDom, component);
    }

    component[INTERNAL_VAR_NAME].dom[INTERNAL_VAR_NAME].id = component[INTERNAL_VAR_NAME].id;

    if (component[INTERNAL_VAR_NAME].mounted) emitHook(component, 'didUpdate');
  } else emitHook(component, 'didUpdate');
}

function immediateCall(func, callback) {
  window.setImmediate(function() {
    func();
    if (callback) callback();
  });
}

const resolvedPromise = Promise.resolve();

function promiseCall(func, callback) {
  return resolvedPromise.then(function() {
    func();
    if (callback) callback();
  });
}

function timeoutCall(func, callback) {
  setTimeout(function() {
    func();
    if (callback) callback();
  }, 0);
}

let asyncCall;

if (window.setImmediate) asyncCall = immediateCall;
else if (window.Promise) asyncCall = promiseCall;
else asyncCall = timeoutCall;

var asyncCall$1 = asyncCall;

let renderQueue = [];
let rendered = {};

function flushRender() {
  renderQueue.forEach(component => {
    if (!rendered[component[INTERNAL_VAR_NAME].id]) {
      render(component);
      rendered[component[INTERNAL_VAR_NAME].id] = true;
    }
  });

  renderQueue = [];
  rendered = {};
}

function asyncRender(component, callback) {
  renderQueue.push(component);
  if (renderQueue.length === 1) asyncCall$1(flushRender, callback);
}

class Component {
  constructor(opts, parent) {
    let id = generateId();

    this[INTERNAL_VAR_NAME] = {};
    registerHooks(this, opts.manifest);
    emitHook(this, 'willCreate');

    this[INTERNAL_VAR_NAME].id = id;
    if (parent) parent[INTERNAL_VAR_NAME].children[id] = this;

    this[INTERNAL_VAR_NAME].name = opts.name;
    this[INTERNAL_VAR_NAME].factories = opts.manifest.factories ? opts.manifest.factories : {};
    this[INTERNAL_VAR_NAME].parent = parent;
    this[INTERNAL_VAR_NAME].app = parent ? parent[INTERNAL_VAR_NAME].app : this;
    this[INTERNAL_VAR_NAME].scope = opts.scope;
    this[INTERNAL_VAR_NAME].children = {};
    this[INTERNAL_VAR_NAME].props = opts.props ? opts.props : {};
    this[INTERNAL_VAR_NAME].defaultProps = opts.manifest.defaultProps;

    if (this[INTERNAL_VAR_NAME].defaultProps)
      this.props = assign({}, this[INTERNAL_VAR_NAME].defaultProps, this[INTERNAL_VAR_NAME].props);

    this[INTERNAL_VAR_NAME].subscribers = {};

    this[INTERNAL_VAR_NAME].subscriptions = opts.manifest.subscriptions
      ? opts.manifest.subscriptions
      : [];

    this[INTERNAL_VAR_NAME].render = opts.manifest.render
      ? opts.manifest.render.bind(this)
      : null;

    this[INTERNAL_VAR_NAME].shouldUpdateData = shouldUpdateData;
    this[INTERNAL_VAR_NAME].shouldUpdateProps = shouldUpdateProps;

    this[INTERNAL_VAR_NAME].subscriptions.forEach(item => {
      let store = item.store;
      item.fields.forEach(field => {
        if (store[INTERNAL_VAR_NAME].data.hasOwnProperty(field))
          store[INTERNAL_VAR_NAME].subscribers[field][id] = this;
      });
    });

    if (opts.manifest.props) {
      opts.manifest.props.forEach(prop => {
        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[INTERNAL_VAR_NAME].props[prop] !== undefined &&
              this[INTERNAL_VAR_NAME].props[prop] !== null
              ? this[INTERNAL_VAR_NAME].props[prop]
              : this[INTERNAL_VAR_NAME].defaultProps[prop];
          }
        });
      });
    }

    if (opts.manifest.data) {
      this[INTERNAL_VAR_NAME].data = opts.manifest.data.bind(this)();

      Object.keys(this[INTERNAL_VAR_NAME].data).forEach(prop => {
        this[INTERNAL_VAR_NAME].subscribers[prop] = {};

        Object.defineProperty(this, prop, {
          enumerable: true,
          get: function() {
            return this[INTERNAL_VAR_NAME].data[prop];
          },
          set: function(value) {
            if (this[INTERNAL_VAR_NAME].shouldUpdateData(this[INTERNAL_VAR_NAME].data[prop], value)) {
              this[INTERNAL_VAR_NAME].data[prop] = value;
              asyncRender(this);

              let subscribers = this[INTERNAL_VAR_NAME].subscribers[prop];
              Object.keys(subscribers).forEach(key =>
                asyncRender(subscribers[key])
              );
            }
          }
        });
      });
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

  get $data() {
    return assign({}, this[INTERNAL_VAR_NAME].data);
  }

  set $data(data) {
    Object.keys(data).forEach(key => {
      if (this[INTERNAL_VAR_NAME].data !== undefined) this[key] = data[key];
    });
  }

  get $props() {
    return assign({}, this[INTERNAL_VAR_NAME].props);
  }

  get $app() {
    return this[INTERNAL_VAR_NAME].app;
  }

  get $dom() {
    return this[INTERNAL_VAR_NAME].dom;
  }

  $render() {
    render(this);
  }
}

let scope = generateScope(ROOT_NAME);

class Modeste extends Component {
  constructor(manifest, props) {
    super({
      name: ROOT_NAME,
      manifest,
      props,
      scope
    });

    this[INTERNAL_VAR_NAME].parent = null;
    this[INTERNAL_VAR_NAME].isApp = true;

    if (manifest.style) addStyles(manifest.style(), scope);
    this[INTERNAL_VAR_NAME].wrap = manifest.selector
      ? document.querySelector(manifest.selector)
      : null;

    this.$render();
  }

  get $wrap() {
    return this[INTERNAL_VAR_NAME].wrap;
  }

  set $props(props) {
    setProps(this, props);
  }

  $render() {
    super.$render();

    if (!this[INTERNAL_VAR_NAME].render) return;

    if (!this[INTERNAL_VAR_NAME].mounted) {
      if (!this[INTERNAL_VAR_NAME].wrap) return emitMount(this);

      while (this[INTERNAL_VAR_NAME].wrap.firstChild)
        this[INTERNAL_VAR_NAME].wrap.removeChild(this[INTERNAL_VAR_NAME].wrap.firstChild);

      this[INTERNAL_VAR_NAME].wrap.appendChild(this[INTERNAL_VAR_NAME].dom);
      emitMount(this);
    }
  }
}

export default Modeste;
