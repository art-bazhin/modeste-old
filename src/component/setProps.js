import { INTERNAL_VAR_NAME as m } from '../constants';
import render from './render';
import assign from '../utils/assign';
import validateProps from './validateProps';
import emitHook from './emitHook';

export default function setProps(component, props) {
  Object.keys(props).forEach(key => {
    if (props[key] === undefined) delete props[key];
  });

  if (MODESTE_ENV === 'development')
    validateProps(props, component[m].propList, component);

  let newProps = component[m].defaultProps
    ? assign({}, component[m].defaultProps, props)
    : props;

  if (MODESTE_ENV === 'development')
    validateProps(newProps, component[m].propList, component);

  if (component[m].shouldUpdateProps(component[m].props, newProps)) {
    let oldProps = component[m].props;
    component[m].props = newProps;

    emitHook(component, 'didUpdateProps', oldProps, newProps);

    render(component);
  }
}
