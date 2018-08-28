/* globals test expect */
'use strict';

import { chooseAsyncFunc } from '../../src/utils/asyncCall';

test('Immediate async function import', () => {
  expect(typeof chooseAsyncFunc()).toBe('function');
});

test('Promise async function import', () => {
  global.setImmediate = false;
  expect(typeof chooseAsyncFunc()).toBe('function');
});

test('Timeout async function import', () => {
  global.setImmediate = false;
  global.Promise = false;
  expect(typeof chooseAsyncFunc()).toBe('function');
});
