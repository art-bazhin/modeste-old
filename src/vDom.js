export function tag(tag, opts, children) {
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

export function component(component, opts) {
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
