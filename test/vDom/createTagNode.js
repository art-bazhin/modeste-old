/* globals test expect */

import e from '../../src/vDom/createTagNode';

test('Creating a tag vNode with a right tag name', () => {
  let testNode;

  testNode = t('div');
  expect(testNode.tag).toBe('div');

  testNode = t('span');
  expect(testNode.tag).toBe('span');

  testNode = t('p');
  expect(testNode.tag).toBe('p');
});

test('Creating a tag vNode with a right props, attrs and utility fields', () => {
  let testNode;

  testNode = t('div', {
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

  testNode = t('div');
  expect(testNode.children).toEqual([]);

  testNode = t('div', [
    'test',
    t('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
  expect(testNode.children).toEqual([
    'test',
    t('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);

  testNode = t('div', { value: 'test' }, [
    'test',
    t('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
  expect(testNode.children).toEqual([
    'test',
    t('div', { className: 'test-class' }, ['nested']),
    null,
    'another-test'
  ]);
});
