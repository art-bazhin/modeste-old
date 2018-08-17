import toKebabCase from '../utils/toKebabCase';

export default function prepareVDom(vDom, scope) {
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
