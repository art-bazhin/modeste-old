/* globals test expect */

'use strict';

import e from '../../src/vDom/createElementNode';
import sameTypeAndTag from '../../src/dom/sameTypeAndTag';

test('Testing if dom and vdom node has same type and tag', () => {
  let vNode = 'test';
  let node = document.createTextNode('foo');
  expect(sameTypeAndTag(node, vNode)).toBeTruthy();

  node = document.createElement('div');
  expect(sameTypeAndTag(node, vNode)).toBeFalsy();

  vNode = e('div');
  expect(sameTypeAndTag(node, vNode)).toBeTruthy();

  vNode = null;
  expect(sameTypeAndTag(node, vNode)).toBeFalsy();

  node = document.createComment('');
  expect(sameTypeAndTag(node, vNode)).toBeTruthy();
});
