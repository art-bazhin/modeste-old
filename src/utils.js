export function updateState(original, update) {
  let stateChanged = false;

  for (let prop in update) {
    if (
      typeof original[prop] === 'object' &&
      typeof update[prop] === 'object'
    ) {
      stateChanged |= updateState(original[prop], update[prop]);
    } else if (original[prop] !== update[prop]) {
      original[prop] = update[prop];
      stateChanged = true;
    }
  }

  return stateChanged;
}

export function processStyle(_style, prefix) {
  let styleElement = document.createElement('style');
  let style = _style;
  let styleString = '';
  let regex = /\._/gm;
  let repl = '.' + prefix;

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

  function processRule(rule) {
    styleString += rule.selector.replace(regex, repl) + '{';
    for (let prop in rule.props) {
      styleString += prop + ':' + rule.props[prop] + ';';
    }
    styleString += '}';
  }
}
