/* globals test expect */

import t from '../../src/vDom/createTagNode';

test('first test', () => {
  console.log(t('div'));
  expect(1).toBe(1);
});
