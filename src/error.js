export default class JustError extends Error {
  constructor(...args) {
    super(...args);
    this.name = 'Just Error';
    this.message = '[JUST ERROR] ' + this.message;
    Error.captureStackTrace(this, JustError);
  }
}
