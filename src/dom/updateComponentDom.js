import { INTERNAL_VAR_NAME as m } from '../constants';
import createComponent from '../component/createComponent';
import setProps from '../component/setProps';
import render from '../component/render';
import emitMount from '../component/emitMount';
import removeComponent from '../component/removeComponent';

export default function updateComponentDom(dom, vDom, parent) {
  if (dom[m] && dom[m].id) {
    let id = dom[m].id;
    let component = parent[m].children[id];

    if (component[m].name === vDom.component) {
      component[m].dom = dom;
      setProps(component, vDom.props);

      if (vDom.ref) vDom.ref(component);

      return;
    } else {
      removeComponent(parent[m].children[id]);
    }
  }

  let component = createComponent(vDom.component, vDom.props, parent);
  component[m].dom = dom;

  if (vDom.ref) vDom.ref(component);

  render(component);

  if (vDom.key !== undefined) component[m].dom[m].key = vDom.key;
  else if (component[m].dom[m].key !== undefined)
    delete component[m].dom[m].key;

  if (parent[m].mounted) emitMount(component);
}
