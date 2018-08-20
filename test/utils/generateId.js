/* globals test expect */

import generateId from '../../src/utils/generateId';

test('Generating unique id', () => {
  let store = {};

  for (let i = 0; i < 1000; i++) {
    let firstId = generateId(store);
    let secondId = generateId(store);

    expect(firstId).not.toBe(secondId);
  }
});

test('Applying middleware function to id', () => {
  let store = {};
  let prefix = 'PROCESSED_';

  function middleware(id) {
    return prefix + id;
  }

  let id = generateId(store, middleware);

  expect(id.indexOf(prefix)).toBe(0);
});
