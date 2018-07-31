export function updateState(original, update) {
  let stateChanged = false;

  Object.keys(update).forEach(prop => {
    if (
      typeof original[prop] === 'object' &&
      typeof update[prop] === 'object'
    ) {
      stateChanged |= updateState(original[prop], update[prop]);
    } else if (original[prop] !== update[prop]) {
      original[prop] = update[prop];
      stateChanged = true;
    }
  });

  return stateChanged;
}

export function processStyle(style, scope) {
  if (!style) return;

  let styleElement = document.createElement('style');

  let regex = /:scoped/gm;
  let repl = '.' + scope;

  let rootRegex = /:component/gm;
  let rootRepl = '.' + getScopeRoot(scope);

  styleElement.textContent = style
    .replace(regex, repl)
    .replace(rootRegex, rootRepl);

  document.head.appendChild(styleElement);

  return styleElement;
}

export function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}

export function getScopeRoot(scope) {
  return '_' + scope;
}

export function generateId(maxValue, store, middleware) {
  let id;

  do {
    id = (Math.random() * maxValue).toFixed(0);
    if (middleware) id = middleware(id);
  } while (store[id]);

  store[id] = true;

  return id;
}
