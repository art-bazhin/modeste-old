const resolvedPromise = Promise.resolve();

export default function promiseCall(func, callback) {
  resolvedPromise.then(function() {
    func();
    if (callback) callback();
  });
}
