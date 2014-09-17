# Helix

An efficient implementation of infinite scroll for the web.

## API

These requirements must be met by the consumer of Helix:

1. The scroll container is in the DOM.
2. The scroll container has its own scroll styles applied.
  - This includes use of `overflow: auto`.
  - Explicit height.
  - etc.

### Instantiation

1. The `requestModels` function.

  ```
  // Invoked when the Helix instance needs data to construct its list elements.
  //
  // @param {Number} startIndex     Starting index of the model to supply.
  // @param {Number} count          Number of items Helix is expecting.
  // @param {Function} supplyModels Call this function to supply Helix with the
  //                                models requested as an array. If less models
  //                                are supplied than asked for, Helix assumes
  //                                it is at the end of the scroll range.
  var requestModels = function (startIndex, count, supplyModels) {
    var endIndex = startIndex + count - 1;
    $.getJSON("SOME_ENDPOINT?start=" + startIndex + "&end=" + endIndex,
        function (models) {
          supplyModels(models);
        }
    );
    return;
  };
  ```

2. The `requestElement` function.

  ```
  // Invoked when the Helix instance needs to fill a list element.
  //
  // @param {Anything} model The model supplied in requestModels described
  //                         above.
  //
  // @returns A jQuery element to be inserted into the list.
  var requestElement = function (model) {
     return $('<div><p>' + model.text +'<img src="' + model.src + '"/></p></div>');
  };
  ```

3. The constructor.

  ```
  var $myScrollContainer = $('ul#my-scroll-container');
  var myHelix = new Helix($myScrollContainer, {
    // ========
    // required
    // ========
    requestModels: requestModels,
    requestElement: requestElement,

    // ========
    // optional
    // ========

    // Called when an element was inserted into the DOM or was removed from the
    // DOM. The arguments passed in are:
    //
    // @param {jQuery Element} $element The jQuery element inserted by the
    //                                  the requestElement function.
    //
    // @param {Number} elementIndex     The index of the element in the list.
    wasInsertedIntoDOM: FUNCTION,
    willBeRemovedFromDOM: FUNCTION,

    // The number of items to prefetch below and above the current viewport.
    // Defaults to 10.
    prefetch: 10,

    // Throttle time intervals for requesting views on resize and scroll events.
    // Defaults to 200ms.
    resizeThrottle: 200,
    scrollThrottle: 200,

    // If you know that the height of each element will be the same, supplying
    // this option removes the need for a cache or calling $.height on each
    // element. By default, Helix does not assume element heights are static.
    elementHeight: ELEMENT_HEIGHT_IN_PIXELS,

    // ==================
    // optional - caching
    // ==================

    // To enable the height cache, you must either pass true if you are fine
    // with the default cache options or an object hash with the options you
    // would like to override. By default a height cache is not maintained and
    // heights are calculated on the fly. It is advised to enable the height
    // cache if heights of the scroll viewport elements vary. If the
    // elementHeight option is supplied upon instantiation, caching is
    // disabled and these options are ignored.
    cache: {
      // If several element heights change on resize, this option should be
      // set to true if it makes sense to simply compute all list element
      // heights on the fly again. By default, this is false.
      flushOnResize: false
    }
  });
  ```

### Helix.prototype.setViewportHeight

Call this if the height of scroll container has changed.

```
$(window).on('resize', function () {

  // @param {Number} scrollContainerHeight Represents the scroll viewport height
  //                                       in pixels.
  myHelix.setViewportHeight($myScrollContainer.height());
});
```

### Helix.prototype.setElementHeight

Call this if the elements in the scroll viewport changed height and are all the
same height.

```
$(window).on('resize', function () {
  if (CONDITION_FOR_HEIGHT_100 && !ALREADY_HEIGHT_100) {
    ALREADY_HEIGHT_100 = true;
    ALREADY_HEIGHT_200 = false;
    myHelix.setElementHeight(100);
  } else (CONDITION_FOR_HEIGHT_200 && !ALREADY_HEIGHT_200) {
    ALREADY_HEIGHT_200 = true;
    ALREADY_HEIGHT_100 = false;
    myHelix.setElementHeight(200);
  }
});
```

### Helix.prototype.setElementHeightAtIndex

Call this if a specific element in the list has changed height.

```
$(window).on('resize', function () {
  if (CONDITION_FOR_SPECIFIC_ELEMENT_CHANGING_HEIGHT) {

    // @param {Number} elementIndex The index of the item in the list that has
    //                              changed its height.
    //
    // @param {Number} newHeight    The new height in pixels for the element
    //                              that has changed height. If this argument is
    //                              not supplied, the height value calculation
    //                              is deferred until the Helix instance needs
    //                              it.
    myHelix.setElementHeightAtIndex(elementIndex, NEW_HEIGHT);
  }
});
```

## Dependencies

1. [jQuery](http://jquery.com/)

## Contributing

1. Make sure there isn't another pull request open that addresses the same
functionality or issue that your contribution will address.
2. For this repository, commit code to a branch and create a pull request.
3. Link to any GitHub issues your pull request may address or solve.

## Why?

You may ask "why implement infinite scroll"? Isn't this a solved problem?

Unfortunately, the current solutions for infinite scroll are either incomplete,
are not open sourced or simply do not work. Here's a list of solutions you may
find online:

* [This nice overview on StackOverflow.](http://stackoverflow.com/a/12613687/696130)
(Not open sourced.)
* [This nice overview by LinkedIn.](http://engineering.linkedin.com/linkedin-ipad-5-techniques-smooth-infinite-scrolling-html5)
(Not open sourced.)
* [This kick ass Facebook app demo by Sencha.](http://www.sencha.com/blog/the-making-of-fastbook-an-html5-love-story/)
(Not open sourced.)
* [infinity.js](https://github.com/airbnb/infinity)
([Not maintained.](https://github.com/airbnb/infinity/issues/50))
* [iScroll](http://iscrolljs.com/#infinite-scrolling)
(Not production ready yet.)
* [Paul Irish's Infinite Scroll](https://github.com/paulirish/infinite-scroll)
Does not cleanly decouple the mechanism of grabbing data and inserting/creating
new views well. Also does not handle recycling DOM nodes.

## Design

The design of the API was heavily influenced by [iScroll](http://iscrolljs.com/#infinite-scrolling).

The design of the infinite scroll functionality itself is fairly
straightforward:

1. Keep around enough elements to fill the scroll viewport.
2. Have top and bottom "stub" elements which change height to give the perceived
effect of having many items in the scroll view - even when there are only a few.
3. Avoid having to calculate element heights whenever possible.
4. Do not hold on to data or views. Any view or data caching functionality is
left up to the consumer of Helix to implement.

This last point is very important and allows for pure MVC models to be
implemented where the controller deals with setting up the models (data) and
list element views. This also allows Helix to be used in many different
environments and with many different frameworks since it does not actually
handle constructing the views or fetching the data source.
