/* globals test expect */
'use strict';

import ModesteError from '../../src/utils/ModesteError';

test('ModesteError object is inherited from Error', () => {
  let error = new ModesteError();
  expect(error instanceof Error).toBeTruthy();
});
