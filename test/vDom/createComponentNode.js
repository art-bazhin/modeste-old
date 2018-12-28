/* globals test expect */

import c from '../../src/vDom/createComponentNode';

test('Creating a component vNode with a right component name', () => {
  let testNode;

  testNode = c('my-component');
  expect(testNode.type).toBe('component');
  expect(testNode.name).toBe('my-component');
});

test('Creating a component vNode with a right props and utility fields', () => {
  let testNode;

  testNode = c('some-component', {
    someProp: 'propValue',
    anotherProp: 'anotherPropValue',
    numberProp: 123,
    objectProp: {
      a: 1,
      b: 2
    },
    arrayProp: [1, 2, 3],
    booleanProp: true,
    $ref: 'refValue',
    $someUtility: 1000
  });

  expect(testNode.type).toBe('component');
  expect(testNode.name).toBe('some-component');

  expect(testNode.props).toEqual({
    someProp: 'propValue',
    anotherProp: 'anotherPropValue',
    numberProp: 123,
    objectProp: {
      a: 1,
      b: 2
    },
    arrayProp: [1, 2, 3],
    booleanProp: true
  });

  expect(testNode.core.ref).toBe('refValue');
  expect(testNode.core.someUtility).toBe(1000);
});
