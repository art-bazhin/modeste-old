/* globals test expect */
'use strict';

import promiseCall from '../../src/utils/promiseCall';

test('Async calling function (Promise realization)', () => {
  let string = 'waiting';

  function func() {
    string = 'done';
  }

  promiseCall(func, function() {
    expect(string).toBe('done');
  });

  expect(string).not.toBe('done');
});
