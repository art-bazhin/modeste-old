export function strictEqual(a, b) {
  return a === b;
}

export function shallowCompare(a, b) {
  let aKeys = Object.keys(a);
  let bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) return false;

  for (let i = 0; i < aKeys.length; i++) {
    let key = aKeys[i];
    let index = bKeys.indexOf(key);

    if (index < 0) return false;
    if (!strictEqual(a[key], b[key])) return false;
  }

  return true;
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
