/* globals test expect */

import e from '../../src/vDom/createElementNode';
import c from '../../src/vDom/createComponentNode';
import addClass from '../../src/vDom/addClass';

test('Run add class function with wrong first argument', () => {
  expect(addClass()).toBeUndefined();
  expect(addClass('test')).toBeUndefined();
});

test('Run add class function with wrong second argument', () => {
  let testNode = t('div', { value: 'someValue' }, ['string']);
  expect(addClass(testNode)).toBeUndefined();
});

test('Run add class function on component vNode', () => {
  let testNode = c('test', { value: 'someValue' });
  expect(addClass(testNode)).toBeUndefined();
  expect(testNode.props.className).toBeUndefined();
});

test('Add class to existing tag vNode', () => {
  let testNode = t('div', { value: 'someValue' }, ['string']);
  addClass(testNode, 'some-class-name');

  expect(testNode.props.className).toBe('some-class-name');
  expect(testNode.attrs.class).toBe('some-class-name');

  addClass(testNode, 'another-class and-one-more-class');
  expect(testNode.props.className).toBe(
    'some-class-name another-class and-one-more-class'
  );
  expect(testNode.attrs.class).toBe(
    'some-class-name another-class and-one-more-class'
  );

  testNode = t(
    'div',
    {
      value: 'someValue',
      className: 'initial prop classes',
      _class: 'initial attr classes'
    },
    ['string']
  );
  addClass(testNode, 'some-class-name');

  expect(testNode.props.className).toBe('initial prop classes some-class-name');
  expect(testNode.attrs.class).toBe('initial attr classes some-class-name');
});
