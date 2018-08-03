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

export function deepCompare(a, b) {
  if (typeof a === 'object' && typeof b === 'object') {
    let aKeys = Object.keys(a);
    let bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (let i = 0; i < aKeys.length; i++) {
      let key = aKeys[i];
      let index = bKeys.indexOf(key);

      if (index < 0) return false;
      else {
        bKeys.splice(index, 1);
        if (!deepCompare(a[key], b[key])) return false;
      }
    }

    return bKeys.length === 0;
  }

  return a === b;
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
