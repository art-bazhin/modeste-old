export default function getScope(parentName, name) {
  return `__${parentName}__${name}__`;
}
