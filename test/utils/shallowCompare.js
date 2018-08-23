/* globals test expect */
'use strict';

import shallowCompare from '../../src/utils/shallowCompare';

let empty1 = {};
let empty2 = {};

let arr1 = [1, 2, 3];
let arr2 = [1, 2, 3];

let obj1 = { a: 1, b: 2 };
let obj2 = { a: 1, b: 2 };

let first = {
  a: 'a',
  b: 'b',
  c: 123,
  d: arr1,
  e: obj1
};

let second = {
  a: 'a',
  b: 'b',
  c: 123,
  d: arr1,
  e: obj1
};

let third = {
  a: 'a',
  b: 'b',
  c: 123,
  d: arr2,
  e: obj1
};

let fourth = {
  a: 'a',
  b: 'b',
  c: 123,
  d: arr1,
  e: obj2
};

let less = {
  a: 'a',
  b: arr1
};

let more = {
  a: 'a',
  b: 'b',
  c: arr1
};

test('Performing shallow comparison of two empty objects', () => {
  expect(shallowCompare(empty1, empty2)).toBe(true);
});

test('Performing shallow comparison of two objects with primitive fields', () => {
  expect(shallowCompare(obj1, obj2)).toBe(true);
});

test('Performing shallow comparison of two objects with object fields', () => {
  expect(shallowCompare(first, second)).toBe(true);
  expect(shallowCompare(first, third)).toBe(false);
  expect(shallowCompare(first, fourth)).toBe(false);
});

test('Performing shallow comparison of two objects with different number of fields', () => {
  expect(shallowCompare(less, more)).toBe(false);
  expect(shallowCompare(more, less)).toBe(false);
});
