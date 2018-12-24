import { INTERNAL_VAR_NAME as m } from '../constants';
import createComponent from '../component/createComponent';
import setProps from '../component/setProps';
import render from '../component/render';
import emitMount from '../component/emitMount';
import removeComponent from '../component/removeComponent';

export default function updateComponentDom(dom, vNode, parent) {
  if (dom[m] && dom[m].id) {
    let id = dom[m].id;
    let component = parent[m].children[id];

    if (component[m].name === vNode.name) {
      component[m].dom = dom;
      setProps(component, vNode.props);

      if (vNode.core.ref) vNode.core.ref(component);

      return;
    } else {
      removeComponent(parent[m].children[id]);
    }
  }

  let component = createComponent(vNode.name, vNode.props, parent);
  component[m].dom = dom;

  if (vNode.core.ref) vNode.core.ref(component);

  render(component);

  if (vNode.core.key !== undefined) component[m].dom[m].key = vNode.core.key;
  else if (component[m].dom[m].key !== undefined)
    delete component[m].dom[m].key;

  if (parent[m].mounted) emitMount(component);
}
