/* globals jest test expect */
'use strict';

import immediateCall from '../../src/utils/immediateCall';

test('Async function call without a callback (setImmediate realization)', () => {
  jest.useFakeTimers();

  let func = jest.fn();
  let callback = jest.fn();

  immediateCall(func);

  expect(func).not.toBeCalled();
  expect(callback).not.toBeCalled();

  jest.runAllTimers();

  expect(func).toBeCalled();
  expect(callback).not.toBeCalled();
});

test('Async function call with a callback (setImmediate realization)', () => {
  jest.useFakeTimers();

  let func = jest.fn();
  let callback = jest.fn();

  immediateCall(func, callback);

  expect(func).not.toBeCalled();
  expect(callback).not.toBeCalled();

  jest.runAllTimers();

  expect(func).toBeCalled();
  expect(callback).toBeCalled();
});
