export default function immediateCall(func, callback) {
  window.setImmediate(function() {
    func();
    if (callback) callback();
  });
}
