/* globals test expect */

import t from '../../src/vDom/createTagNode';
import addClass from '../../src/vDom/addClass';

test('Adding class to existing tag vNode', () => {
  let testNode;

  testNode = t('div', { value: 'someValue' }, ['string']);
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
