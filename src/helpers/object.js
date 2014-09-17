/*
  Return the value of object[key]. If object[key] does not exist, check if
  fallbackObject does and return fallbackObject[key]. If object and
  fallbackObject do not exist, return undefined.

  @param {Object} object         The first object to be checked for the value
                                 pointed to by object[key].
  @param {String} key            The key to check against.
  @param {Object} fallbackObject Optional fallback object to be checked
                                 against if object[key] does not exist.

  @return {Anything} Any valid value that can be pointed to by object[key]
                     or fallbackObject[key].
*/
exports.getValue = function (object, key, fallbackObject) {
  if ((value = object[key]) == null) {
    if (fallbackObject != null) {
      value = fallbackObject[key];
    }
  }
  return value;
};
