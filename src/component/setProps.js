import { INTERNAL_VAR_NAME as m } from '../constants';

export default function setProps(component, props) {
  if (component[m].shouldUpdateProps(component.props, props)) {
    component.props = props;
    render(component);
  }
}
