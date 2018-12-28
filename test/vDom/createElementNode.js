/* globals test expect */

import e from '../../src/vDom/createElementNode';

test('Creating a tag vNode with a right tag name', () => {
  let testNode;

  testNode = e('div');
  expect(testNode.name).toBe('div');

  testNode = e('span');
  expect(testNode.name).toBe('span');

  testNode = e('p');
  expect(testNode.name).toBe('p');
});

test('Creating a tag vNode with a right props, attrs and utility fields', () => {
  let testNode;

  testNode = e('div', {
    className: 'test class names',
    value: 'test',
    _dataSomeAttr: 'someValue',
    _ariaHidden: '',
    $ref: 'refValue',
    $someUtility: 1000
  });

  expect(testNode.name).toBe('div');

  expect(testNode.props).toEqual({
    className: 'test class names',
    value: 'test'
  });

  expect(testNode.attrs).toEqual({
    'data-some-attr': 'someValue',
    'aria-hidden': ''
  });

  expect(testNode.core.ref).toBe('refValue');
  expect(testNode.core.someUtility).toBe(1000);
});

test('Creating a tag vNode with a right children', () => {
  let testNode;

  testNode = e('div');
  expect(testNode.children).toEqual([]);

  testNode = e('div', [
    'test',
    e('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
  expect(testNode.children).toEqual([
    'test',
    e('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);

  testNode = e('div', { value: 'test' }, [
    'test',
    e('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
  expect(testNode.children).toEqual([
    'test',
    e('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
});
