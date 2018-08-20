export default function addStyles(style, scope) {
  if (!style) return;

  let styleElement = document.createElement('style');

  if (scope) {
    let regex = /:\$/gm;
    let repl = '.' + scope;

    styleElement.textContent = style.replace(regex, repl);
  } else {
    styleElement.textContent = style;
  }

  document.head.appendChild(styleElement);

  return styleElement;
}
