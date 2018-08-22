import { INTERNAL_VAR_NAME as m } from '../constants';
import render from './render';

export default function setProps(component, props) {
  if (component[m].shouldUpdateProps(component[m].props, props)) {
    component[m].props = props;
    render(component);
  }
}
