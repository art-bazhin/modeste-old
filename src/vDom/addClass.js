export default function addClass(vNode, className) {
  if (
    !vNode ||
    typeof vNode === 'string' ||
    vNode.type === 'component' ||
    !className
  )
    return;
  if (!vNode.props.className) vNode.props.className = '';
  if (!vNode.attrs.class) vNode.attrs.class = '';

  vNode.props.className = `${vNode.props.className} ${className}`.trim();
  vNode.attrs.class = `${vNode.attrs.class} ${className}`.trim();
}
