/* globals test expect */

'use strict';

import e from '../../src/vDom/createElementNode';
import createDom from '../../src/dom/createDom';

function html(string) {
  return string.replace(/>[ \n]*</gm, '><').trim();
}

test('Creating text node', () => {
  let vNode = 'test node';

  let node = document.createTextNode(vNode);
  let created = createDom(vNode);

  expect(created.nodeType).toBe(node.nodeType);
  expect(created.textContent).toBe(node.textContent);
});

test('Creating element node', () => {
  let wrap1 = document.createElement('div');
  let wrap2 = document.createElement('div');

  wrap1.innerHTML = html(`
    <div data-attr="some value">
      <p>Some text content</p>
      <div class="test"><span>hello</span><span>world</span></div>
    </div>
  `);

  let vNode = e('div', { value: 'test', _dataAttr: 'some value' }, [
    e('p', ['Some text content']),
    e('div', { _class: 'test' }, [e('span', ['hello']), e('span', ['world'])])
  ]);

  let node = createDom(vNode);
  wrap2.appendChild(node);

  expect(wrap1.innerHTML).toBe(wrap2.innerHTML);
  expect(node.value).toBe('test');
});
