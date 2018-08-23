import immediateCall from './immediateCall';
import promiseCall from './promiseCall';
import timeoutCall from './timeoutCall';

let asyncCall;

if (window.setImmediate) asyncCall = immediateCall;
else if (window.Promise) asyncCall = promiseCall;
else asyncCall = timeoutCall;

export default asyncCall;
