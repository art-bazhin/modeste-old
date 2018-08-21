import { INTERNAL_VAR_NAME as m } from '../constants';
import render from './render';
import asyncCall from '../utils/asyncCall';

let renderQueue = {};
let needToRender = true;

function flushRender() {
  Object.keys(renderQueue).forEach(key => {
    if (renderQueue[key][m].isApp || renderQueue[key][m].parent.mounted)
      render(renderQueue[key]);
  });
  renderQueue = {};
  needToRender = true;
}

export default function deferredRender(component, callback) {
  if (!renderQueue[component[m].id]) {
    renderQueue[component[m].id] = component;
  }

  if (needToRender) {
    needToRender = false;
    asyncCall(function() {
      flushRender();
      if (callback) callback();
    });
  }
}
