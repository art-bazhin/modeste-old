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

export function processStyle(_style, scopeClass) {
  let styleElement = document.createElement('style');
  let style = _style;
  let styleString = '';
  let regex = /:\$/gm;
  let repl = '.' + scopeClass;
  let rootClass = '._' + scopeClass;

  if (style instanceof Array) {
    style.forEach(elem => {
      if (elem.media) {
        styleString += '@media ' + elem.media + '{';
        elem.rules.forEach(rule => {
          processRule(rule);
        });
        styleString += '}';
      } else {
        processRule(elem);
      }
    });
  } else {
    styleString = style.replace(regex, repl);
  }

  styleElement.textContent = styleString;
  document.head.appendChild(styleElement);

  return styleElement;

  function processRule(rule) {
    styleString +=
      rule.selector.replace(regex, repl).replace('$root', rootClass) + '{';

    Object.keys(rule.props).forEach(prop => {
      styleString += toKebabCase(prop) + ':' + rule.props[prop] + ';';
    });

    styleString += '}';
  }
}

export function toKebabCase(str) {
  return str.replace(/([A-Z])/g, '-$1').toLowerCase();
}
