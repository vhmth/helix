var arrayHelpers = require('./helpers/array');

exports.models = function (instance, onFinish) {
  var count = instance.prefetch,
    start;

  if (instance.scrollState.downScroll) {
    if (instance.prefetchCaches.next.length > 0) {
      // TODO: we should try to call onFinish with the next model here if it
      //       should be put into the viewport. if it shouldn't, we should just
      //       return. if we are half-way through the cache, we should request
      //       the next "count" items and append to the "next" prefetch cache
      //       without requesting any more elements.
      return;
    }
    start = instance.bottomModel;
  } else {
    if (instance.prefetchCaches.prev.length > 0) {
      // TODO: we should try to call onFinish with the previous model here if it
      //       should be put into the viewport. if it shouldn't, we should just
      //       return. if we are half-way through the cache, we should request
      //       the previous "count" items and prepend to the "prev" prefetch
      //       cache without requesting any more elements.
      return;
    }
    start = Math.max(instance.topModel - instance.prefetch, 0);
    count = instance.topModel - start;
  }
  instance.requestModels(start, count, onFinish);
};

// TODO
exports.elements = function (instance, models, onFinish) {
};
