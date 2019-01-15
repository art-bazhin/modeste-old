export default function getDefaultProps(props) {
  let defaultProps = {};

  Object.keys(props).forEach(key => {
    if (props[key].default !== undefined) {
      defaultProps[key] = props[key].default;
    }
  });

  return defaultProps;
}
