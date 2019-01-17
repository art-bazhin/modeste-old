/* globals test expect */

'use strict';

import e from '../../src/vDom/createElementNode';
import c from '../../src/vDom/createComponentNode';
import createDom from '../../src/dom/createDom';
import updateDom from '../../src/dom/updateDom';
import Modeste from '../../src/main';

test('Update dom node', () => {
  let refTest = false;
  let testRefFunc = function() {
    refTest = true;
  };

  let vDom = e('div', [
    e('p', ['test node']),
    e('div', [
      e('span', { _dataTest: 'foo' }, ['bar', e('span', ['another bar'])])
    ])
  ]);

  let resultVDom = e('div', [
    e('p', ['Another test node']),
    e('div', [
      e('span', { _dataTest: 'foo foo', _ariaHidden: '', $ref: testRefFunc }, [
        'test'
      ]),
      e('p', ['test paragraph'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
  expect(refTest).toBeTruthy();
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

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
});

test('Update dom node with keyed array to not keyed array', () => {
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
      e('span', { _dataTest: 'foo' }, ['test1']),
      e('span', { _dataTest: 'foo' }, ['test3']),
      e('span', { _dataTest: 'foo' }, ['test5'])
    ])
  ]);

  let dom = createDom(vDom);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
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

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
});

test('Update dom node made by native functions', () => {
  let dom = document.createElement('div');
  let resultVDom = e('div', { _dataTest: '123' });
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom);

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
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

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
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

  expect(container.children[0].outerHTML).toBe(resultDom.outerHTML);
});

test('Update component dom node', () => {
  let container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  let component = {
    props: {
      name: 'boolean'
    },

    render(e) {
      return e('div', { id: 'component' }, [
        e('span', [`Hello ${this.name}!`])
      ]);
    }
  };

  let app = new Modeste(
    {
      components: {
        component
      },

      render(e, c) {
        return e('div', { id: 'app' }, [c('component', { name: 'world' })]);
      }
    },
    '#container'
  );

  let dom = document.getElementById('component');

  let resultVDom = c('component', {
    name: 'cruel world'
  });
  let resultDom = createDom(
    e('div', { id: 'component' }, [e('span', ['Hello cruel world!'])])
  );

  updateDom(dom, resultVDom, app);

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
});

test('Update component root dom element', () => {
  let container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  let app = new Modeste(
    {
      render(e) {
        return e('div', { id: 'app' }, ['foo bar']);
      }
    },
    '#container'
  );

  let dom = document.getElementById('app');
  let resultVDom = e('span', { id: 'app' }, ['foo bar']);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom, app);
  dom = document.getElementById('app');

  expect(dom.outerHTML).toBe(resultDom.outerHTML);
});

test('Replace component dom node with element node', () => {
  let container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  let component = {
    props: {
      name: 'string'
    },

    render(e) {
      return e('div', { id: 'component' }, [
        e('span', [`Hello ${this.name}!`])
      ]);
    }
  };

  let app = new Modeste(
    {
      components: {
        component
      },

      render(e, c) {
        return e('div', { id: 'app' }, [c('component', { name: 'world' })]);
      }
    },
    '#container'
  );

  let appDom = document.getElementById('app');
  let dom = document.getElementById('component');
  let resultVDom = e('span', ['foo bar']);
  let resultDom = createDom(resultVDom);

  updateDom(dom, resultVDom, app);

  expect(appDom.firstChild.outerHTML).toBe(resultDom.outerHTML);
});

test('Trigger mount while updationg nested components', () => {
  let container = document.createElement('div');
  container.id = 'container';
  document.body.appendChild(container);

  let mount = false;

  let component = {
    didMount() {
      mount = true;
    },

    render(e) {
      return e('div');
    }
  };

  let app = new Modeste(
    {
      components: {
        component
      },

      render(e, c) {
        return e('div', { id: 'app' }, [e('div', { id: 'test' })]);
      }
    },
    '#container'
  );

  let dom = document.getElementById('test');
  let resultVDom = e('div', [c('component')]);

  updateDom(dom, resultVDom, app);

  expect(mount).toBeTruthy();
});
