export default function toKebabCase(str) {
  let kebab = str.replace(/([A-Z])/g, '-$1').toLowerCase();
  if (kebab[0] === '-') return kebab.substr(1);
  return kebab;
}
