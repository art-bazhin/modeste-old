/* globals test expect */

'use strict';

import e from '../../src/vDom/createElementNode';
import createDom from '../../src/dom/createDom';
import updateDom from '../../src/dom/updateDom';

function html(string) {
  return string.replace(/>[ \n]*</gm, '><').trim();
}

test('Update dom node', () => {
  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _dataTest: 'foo' }, ['bar', e('span', ['another bar'])])
    ])
  ]);

  let resultVDom = e('div', [
    e('p', ['Another test node']),
    e('div', [
      e('span', { _dataTest: 'foo foo', _ariaHidden: '' }, ['test']),
      e('p', ['test paragraph'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(html(dom.outerHTML)).toBe(html(resultDom.outerHTML));
});

test('Update dom node with keyed array', () => {
  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _dataTest: 'foo', $key: 1 }, ['test1']),
      e('span', { _dataTest: 'foo', $key: 2 }, ['test2']),
      e('span', { _dataTest: 'foo', $key: 3 }, ['test3']),
      e('span', { _dataTest: 'foo', $key: 4 }, ['test4'])
    ])
  ]);

  let resultVDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _dataTest: 'foo', $key: 1 }, ['test1']),
      e('span', { _dataTest: 'foo', $key: 3 }, ['test3']),
      e('span', { _dataTest: 'foo', $key: 2 }, ['test2']),
      e('span', { _dataTest: 'foo', $key: 4 }, ['test4']),
      e('span', { _dataTest: 'foo', $key: 5 }, ['test5'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(html(dom.outerHTML)).toBe(html(resultDom.outerHTML));
});

test('Update dom node with props updates', () => {
  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { test: '123', test2: '3453', test3: '234' }, ['test1'])
    ])
  ]);

  let resultVDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { anotherTest: '777', test2: null, test4: '456' }, ['test1'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(html(dom.outerHTML)).toBe(html(resultDom.outerHTML));
});

test('Update dom node with attr updates', () => {
  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _test: '123', _test2: '3453', _test3: '234' }, ['test1'])
    ])
  ]);

  let resultVDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _anotherTest: '777', _test2: null, _test4: '456' }, ['test1'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(html(dom.outerHTML)).toBe(html(resultDom.outerHTML));
});

test('Replace dom node with node of another type', () => {
  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _test: '123', _test2: '3453', _test3: '234' }, ['test1'])
    ])
  ]);

  let resultVDom = e('section', [
    e('p', ['test node']),
    e('div', [
      e('span', { _anotherTest: '777', _test2: null, _test4: '456' }, ['test1'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  let container = document.createElement('div');
  container.appendChild(dom);

  updateDom(dom, resultVDom);

  expect(html(container.children[0].outerHTML)).toBe(html(resultDom.outerHTML));
});
