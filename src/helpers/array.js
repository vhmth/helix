/*
  Iterate through the array with an iterator, passing in the value and index.
  If the iterator returns false, the iteration is short-circuted.

  @param {Object} arr        The array to iterate through.
  @param {Function} iterator The iterator to invoke for each element in the
                             array
*/
exports.each = function (arr, iterator) {
  var ind;
  for (ind = 0; ind < arr.length; ind++) {
    if (iterator(arr[ind], ind) === false) {
      break;
    }
  }
};
