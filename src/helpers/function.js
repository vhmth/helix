/*
  Returns a throttled version of a function that is called on first fire and,
  at most, once for each interval after.

  @param {Function} func     The function that should be throttled.
  @param {Number}   interval The interval length, in milliseconds, in which
                             func is called at most once.

  @return {Function} Throttled version of function func.
*/
exports.throttle = function (func, interval) {
  var throttleTimer = null,
    firstRun = true;

  return function () {
    if (firstRun) {
      func();
      firstRun = false;
    } else if (throttleTimer === null) {
      throttleTimer = window.setTimeout(function () {
        func();
        throttleTimer = null;
      }, interval);
    }
  }
};
