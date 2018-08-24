export default function addClass(vDom, className) {
  if (!vDom || typeof vDom === 'string' || vDom.component || !className) return;
  if (!vDom.props.className) vDom.props.className = '';
  if (!vDom.attrs.class) vDom.attrs.class = '';

  vDom.props.className = `${vDom.props.className} ${className}`.trim();
  vDom.attrs.class = `${vDom.attrs.class} ${className}`.trim();
}
