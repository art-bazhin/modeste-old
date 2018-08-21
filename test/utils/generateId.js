/* globals test expect */

import generateId from '../../src/utils/generateId';

test('Generating unique id', () => {
  for (let i = 0; i < 1000; i++) {
    let firstId = generateId();
    let secondId = generateId();

    expect(firstId).not.toBe(secondId);
  }
});

test('Applying middleware function to id', () => {
  let prefix = 'PROCESSED_';

  function middleware(id) {
    return prefix + id;
  }

  let id = generateId(middleware);

  expect(id.indexOf(prefix)).toBe(0);
});
