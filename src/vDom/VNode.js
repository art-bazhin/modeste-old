import toKebabCase from '../utils/toKebabCase';

export default class VNode {
  constructor(type, name, opts, children) {
    this.type = type;
    this.name = name;
    this.props = {};

    switch (type) {
      case 'element':
        this.attrs = {};

        if (opts)
          Object.keys(opts).forEach(key => {
            switch (key[0]) {
              case '_':
                this.attrs[toKebabCase(key.substr(1))] = opts[key];
                break;
              default:
                this.props[key] = opts[key];
            }
          });

        this.children = children || [];
        break;

      case 'component':
        if (opts) this.props = opts;
        break;
    }
  }
}
