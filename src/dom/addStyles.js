export default function addStyles(style, scope) {
  if (!style) return;

  let styleElement = document.createElement('style');

  let regex = /:\$/gm;
  let repl = '.' + scope;

  styleElement.textContent = style.replace(regex, repl);

  document.head.appendChild(styleElement);

  return styleElement;
}
