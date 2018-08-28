/* globals test expect */

import assign from '../../src/utils/assign';

test('Assign fields of second and rest arguments to the first argument', () => {
  let a = {
    a: 1
  };

  let b = {
    a: 2,
    b: 3
  };

  let c = {
    c: 'test'
  };

  let result = {
    a: 2,
    b: 3,
    c: 'test'
  };

  expect(assign(a, b, c)).toEqual(result);
});
