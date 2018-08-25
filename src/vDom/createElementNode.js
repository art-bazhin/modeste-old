import toKebabCase from '../utils/toKebabCase';

export default function createElementNode(tag, opts, children) {
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
