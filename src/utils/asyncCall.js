let asyncCall, resolvedPromise;

if (window.setImmediate) asyncCall = window.setImmediate;
else if (window.Promise) {
  resolvedPromise = Promise.resolve();
  asyncCall = function(func) {
    resolvedPromise.then(func);
  };
} else {
  asyncCall = function(func) {
    setTimeout(func, 0);
  };
}

export default asyncCall;
