$(function () {
  var $myScrollContainer = $('ul#my-scroll-container'),
    myHelix = new Helix($myScrollContainer, {
      requestModels: function (startIndex, count, supplyModels) {
        var models = [],
          modelIndex;

        console.log('Requesting models for range ' + startIndex + ':' + (startIndex + count - 1) + '.');

        for (modelIndex = 0; modelIndex < count; modelIndex++) {
          models.push(startIndex + modelIndex);
        }
        supplyModels(models);
      },

      requestElement: function (model) {
        return $('<span>' + model + '</span>');
      }
    });
});
