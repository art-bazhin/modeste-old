/* globals jest test expect */
'use strict';

import timeoutCall from '../../src/utils/timeoutCall';

test('Async function call without a callback (setTimeout realization)', () => {
  jest.useFakeTimers();

  let func = jest.fn();
  let callback = jest.fn();

  timeoutCall(func);

  expect(func).not.toBeCalled();
  expect(callback).not.toBeCalled();

  jest.runAllTimers();

  expect(func).toBeCalled();
  expect(callback).not.toBeCalled();
});

test('Async function call with a callback (setTimeout realization)', () => {
  jest.useFakeTimers();

  let func = jest.fn();
  let callback = jest.fn();

  timeoutCall(func, callback);

  expect(func).not.toBeCalled();
  expect(callback).not.toBeCalled();

  jest.runAllTimers();

  expect(func).toBeCalled();
  expect(callback).toBeCalled();
});
