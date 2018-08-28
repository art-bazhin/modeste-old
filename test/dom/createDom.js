/* globals test expect */

'use strict';

import e from '../../src/vDom/createElementNode';
import c from '../../src/vDom/createComponentNode';
import Modeste from '../../src/main.js';
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

test('Creating element node with key and ref options', () => {
  let wrap1 = document.createElement('div');
  let wrap2 = document.createElement('div');

  wrap1.innerHTML = html(`
    <div data-attr="some value">
      <p>Some text content</p>
      <div class="test"><span>hello</span><span>world</span></div>
    </div>
  `);

  let ref = null;

  let vNode = e('div', { value: 'test', _dataAttr: 'some value' }, [
    e('p', { $ref: r => (ref = r) }, ['Some text content']),
    e('div', { _class: 'test' }, [
      e('span', { $key: 1 }, ['hello']),
      e('span', { $key: 2 }, ['world'])
    ])
  ]);

  let node = createDom(vNode);
  wrap2.appendChild(node);

  expect(wrap1.innerHTML).toBe(wrap2.innerHTML);
  expect(node.value).toBe('test');
  expect(ref.textContent).toBe('Some text content');
});

test('Creating component node', () => {
  let wrap1 = document.createElement('div');
  let wrap2 = document.createElement('div');

  wrap1.innerHTML = html(`
    <div data-attr="some value">
      <p>Some text content</p>
      <div class="test"><span>hello</span><span>world</span></div>
    </div>
  `);

  let component = {
    scope: false,

    render(e) {
      return e('div', { value: 'test', _dataAttr: 'some value' }, [
        e('p', ['Some text content']),
        e('div', { _class: 'test' }, [
          e('span', ['hello']),
          e('span', ['world'])
        ])
      ]);
    }
  };

  let parent = new Modeste({
    components: {
      component
    },

    scope: false,

    render(e) {
      return e('div');
    }
  });

  let vNode = c('component');
  let node = createDom(vNode, parent);

  wrap2.appendChild(node);

  expect(wrap1.innerHTML).toBe(wrap2.innerHTML);
  expect(node.value).toBe('test');
});
