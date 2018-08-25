/* globals test expect */

import e from '../../src/vDom/createElementNode';

test('Creating a tag vNode with a right tag name', () => {
  let testNode;

  testNode = e('div');
  expect(testNode.tag).toBe('div');

  testNode = e('span');
  expect(testNode.tag).toBe('span');

  testNode = e('p');
  expect(testNode.tag).toBe('p');
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

  expect(testNode.tag).toBe('div');

  expect(testNode.props).toEqual({
    className: 'test class names',
    value: 'test'
  });

  expect(testNode.attrs).toEqual({
    'data-some-attr': 'someValue',
    'aria-hidden': ''
  });

  expect(testNode.ref).toBe('refValue');
  expect(testNode.someUtility).toBe(1000);
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
