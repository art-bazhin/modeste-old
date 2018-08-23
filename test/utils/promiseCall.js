/* globals test expect */
'use strict';

import promiseCall from '../../src/utils/promiseCall';

test('Async function call without a callback (Promise realization)', () => {
  let string = 'waiting';

  function func() {
    string = 'done';
  }

  return promiseCall(func).then(() => {
    expect(string).toBe('done');
  });
});

test('Async function call with a callback (Promise realization)', () => {
  let string = 'waiting';

  function func() {
    string = 'done';
  }

  function callback() {
    string += ' callback';
  }

  return promiseCall(func, callback).then(() => {
    expect(string).toBe('done callback');
  });
});
