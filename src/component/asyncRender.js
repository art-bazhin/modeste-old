import { INTERNAL_VAR_NAME as m } from '../constants';
import render from './render';
import asyncCall from '../utils/asyncCall';

let renderQueue = [];
let rendered = {};

function flushRender() {
  renderQueue.forEach(component => {
    if (!rendered[component[m].id]) {
      rendered[component[m].id] = true;
      render(component);
    }
  });

  renderQueue = [];
  rendered = {};
}

export default function asyncRender(component, callback) {
  renderQueue.push(component);
  asyncCall(flushRender, callback);
}
