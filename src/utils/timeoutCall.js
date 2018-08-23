export default function timeoutCall(func, callback) {
  setTimeout(function() {
    func();
    if (callback) callback();
  }, 0);
}
