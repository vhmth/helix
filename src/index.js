var init = require('./init'),
  logger = require('./helpers/logger');

/*
  Constructor.

  @param {jQuery Element} $scrollContainer The container for the scroll view.
                                           List items will be appended into
                                           this element.
  @param {Object} options                  The options hash. For a full list
                                           of valid entries, reference the
                                           README.

                                           Required params:
                                           {
                                             requestModels: @{Function (
                                               @{Number} startIndex,
                                               @{Number} count,
                                               @{Function} supplyModels
                                             )},

                                             requestElement: @{Function (
                                               @{Anything} model
                                             )}
                                           }

  @returns {Object} A helix instance when invoked with "new".
*/
function Helix($scrollContainer, options) {
  this.$scrollContainer = $scrollContainer;
  this.scrollHeight = $scrollContainer.height();

  this.requestModels = options.requestModels;
  this.requestElement = options.requestElement;
  if (this.requestModels == null) {
    logger.error('requestModels method was not supplied on instantiation.');
    return;
  }
  if (this.requestElement == null) {
    logger.error('requestElement method was not supplied on instantiation.');
    return;
  }

  this.wasInsertedIntoDOM = init.option(options, 'wasInsertedIntoDOM');
  this.willBeRemovedFromDOM = init.option(options, 'willBeRemovedFromDOM');
  this.resizeThrottle = init.option(options, 'resizeThrottle');
  this.scrollThrottle = init.option(options, 'scrollThrottle');

  this.cacheOptions = init.option(options, 'cache');
  if (this.cacheOptions) {
    this.cacheOptions = init.getCacheOptions(cacheOptions);
    init.heightCache(this);
  }

  init.listItems(this);
  init.scrollEvent(this);
}

// TODO
Helix.prototype.setViewportHeight = function (viewportHeight) {
};
// TODO
Helix.prototype.setElementHeight = function (elemHeight) {
};
// TODO
Helix.prototype.setElementHeightAtIndex = function (elemIndex, elemeHeight) {
};

/*
  Main Export
*/
window.Helix = Helix;
