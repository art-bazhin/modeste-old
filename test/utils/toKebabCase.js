/* globals test expect */

import toKebabCase from '../../src/utils/toKebabCase';

test('Converting a string to kebab case', () => {
  expect(toKebabCase('')).toBe('');
  expect(toKebabCase('string')).toBe('string');
  expect(toKebabCase('String')).toBe('string');
  expect(toKebabCase('someStringValue')).toBe('some-string-value');
});
