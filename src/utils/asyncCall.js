import immediateCall from './immediateCall';
import promiseCall from './promiseCall';
import timeoutCall from './timeoutCall';

export function chooseAsyncFunc() {
  if (window.setImmediate) return immediateCall;
  else if (window.Promise) return promiseCall;
  else return timeoutCall;
}

export default chooseAsyncFunc();
