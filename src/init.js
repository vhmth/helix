var Cache = require('./cache'),
  logger = require('./helpers/logger'),
  objectHelpers = require('./helpers/object'),
  request = require('./request');

var DEFAULT_INIT_OPTIONS = {
    cache: false,
    prefetch: 10,
    resizeThrottle: 200,
    scrollThrottle: 200,
  },
  DEFAULT_INIT_CACHE_OPTIONS = {
    flushOnResize: false
  },
  LIST_ITEM_CLASS = 'helix-item',
  STUB_ITEM_CLASS = 'helix-stub';

/*
  Return the value pointed to by options[key]. If options[key] does not exist,
  DEFAULT_INIT_OPTIONS[key] is returned.

  @param {Object} options The options passed into the Helix constructor.
  @param {String} key     The key to check against.

  @returns {Anything} Any valid value that can be pointed to by options[key]
                      or DEFAULT_INIT_OPTIONS[key].
*/
exports.option = function (options, optionKey) {
  return objectHelpers.getValue(options, optionKey, DEFAULT_INIT_OPTIONS);
};

/*
  Return a final cache options hash with defaulted values from
  DEFAULT_INIT_CACHE_OPTIONS.

  @param {Object|Booleaon} cacheOptions The option passed into the Helix
                                        constructor.
*/
exports.getCacheOptions = function (cacheOptions) {
  var finalCacheOptions = {},
    cacheOptionKey;

  if (typeof cacheOptions !== 'object') {
    return DEFAULT_INIT_CACHE_OPTIONS;
  }

  for (cacheOptionKey in DEFAULT_INIT_CACHE_OPTIONS) {
    finalCacheOptions[cacheOptionKey] =
      _cacheOption(cacheOptions, cacheOptionKey);
  }
  return finalCacheOptions;
};

// TODO
exports.heightCache = function (instance) {
  instance.heightCache = new Cache();
};

/*
  Populate a helix instance's scroll container with list items.

  @param {Object} instance The helix instance whose $scrollContainer should be
                           populated.
*/
exports.listItems = function (instance) {
  var listItemString = '<li class="' + LIST_ITEM_CLASS + '"></li>',
    stubItemString = '<li class="' + STUB_ITEM_CLASS + '"></li>',
    $scrollContainer = instance.$scrollContainer,
    viewportHeight = instance.scrollHeight,
    $listItem = $(listItemString),
    numElements,
    listItemDefaultHeight,
    itemIndex;

  $scrollContainer.html('');
  $scrollContainer.append(instance.topStub = $(stubItemString));
  $scrollContainer.append($listItem);
  listItemDefaultHeight = $listItem.height();
  numElements = Math.ceil(viewportHeight / listItemDefaultHeight);

  for (itemIndex = 0; itemIndex < numElements - 1; itemIndex++) {
    $scrollContainer.append(listItemString);
  }

  $scrollContainer.append(instance.bottomStub = $(stubItemString));
};

//TODO
exports.scrollEvent = function (instance) {
  var $scrollContainer = instance.$scrollContainer,
    fetching = false;

  instance.bottomModel = instance.topModel = 0;
  instance.prefetchCaches = {
    prev: [],
    next: []
  };
  instance.scrollState = {
    scrollTop: $scrollContainer.scrollTop()
  };

  $scrollContainer.scroll(function () {
    var scrollTop = $scrollContainer.scrollTop();

    if (fetching === false) {
      fetching = true;
      instance.scrollState.downScroll = scrollTop >= instance.scrollTop;

      // TODO: insert loading view here

      request.models(instance, function (models) {
        request.elements(instance, models, function () {
          fetching = false;
          // TODO: remove loading view here
        });
      });
    }

    instance.scrollTop = scrollTop;
  });
  $scrollContainer.trigger('scroll');
};

// Private Functions
var _cacheOption;

/*
  Return the value pointed to by options[key]. If options[key] does not exist,
  DEFAULT_INIT_CACHE_OPTIONS[key] is returned.

  @param {Object} options The cache options passed into the Helix constructor.
  @param {String} key     The key to check against.

  @returns {Anything} Any valid value that can be pointed to by options[key]
                      or DEFAULT_INIT_CACHE_OPTIONS[key].
*/
_cacheOption = function (options, optionKey) {
  return objectHelpers.getValue(options, optionKey, DEFAULT_INIT_CACHE_OPTIONS);
};
