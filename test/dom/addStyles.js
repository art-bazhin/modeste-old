/* globals test expect */

'use strict';

import addStyles from '../../src/dom/addStyles';

test('Add styles to document', () => {
  let styles = `
    :scoped {
      color: red;
    }
  `;

  let element = addStyles(styles);
  expect(element.tagName).toBe('STYLE');
  expect(element.parentNode.tagName).toBe('HEAD');

  let scopedElement = addStyles(styles, 'scopeClass');
  expect(scopedElement.tagName).toBe('STYLE');
  expect(element.parentNode.tagName).toBe('HEAD');
  expect(scopedElement.textContent.indexOf('.scopeClass')).toBeGreaterThan(-1);
  expect(scopedElement.textContent.indexOf(':scoped')).toBe(-1);

  let none = addStyles();
  expect(none).toBeUndefined();
});
