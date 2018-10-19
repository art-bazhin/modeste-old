import { INTERNAL_VAR_NAME as m } from '../constants';
import render from './render';
import assign from '../utils/assign';
import validateProps from './validateProps';

export default function setProps(component, props) {
  Object.keys(props).forEach(key => {
    if (props[key] === undefined) delete props[key];
  });

  let newProps = component[m].defaultProps
    ? assign({}, component[m].defaultProps, props)
    : props;

  validateProps(newProps, component[m].propList, component);

  if (component[m].shouldUpdateProps(component[m].props, newProps)) {
    component[m].props = newProps;
    render(component);
  }
}
