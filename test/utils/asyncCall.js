/* globals test expect */
'use strict';

import asyncCall from '../../src/utils/asyncCall';

test('Async calling function with callback', () => {
  let string = 'waiting';

  function func() {
    string = 'done';
  }

  asyncCall(func, function() {
    expect(string).toBe('done');
  });

  expect(string).not.toBe('done');
});
