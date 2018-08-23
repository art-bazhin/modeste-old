const resolvedPromise = Promise.resolve();

export default function promiseCall(func, callback) {
  return resolvedPromise.then(function() {
    func();
    if (callback) callback();
  });
}
