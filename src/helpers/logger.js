var ERROR_PREFIX = 'Helix <<< Error:',
  INFO_PREFIX  = 'Helix <<< Info:';

/*
  Log an error message.

  @param {String|Object that implements toString} error The error message.
*/
exports.error = function (message) {
  console.error(ERROR_PREFIX + ' ' + message);
};

/*
  Log an info message. Typically used for debugging purposes and should not be
  called within a production build.

  @param {String|Object that implements toString} error The info message.
*/
exports.info = function (message) {
  console.log(INFO_PREFIX + ' ' + message);
};
