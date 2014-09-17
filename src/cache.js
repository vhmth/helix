function Cache() {
  // TODO: Use an AVL tree instead https://github.com/vhmth/helix/issues/1
  this.cache = [];
}

Cache.prototype.get = function (key) {
  return this.cache[key];
};

Cache.prototype.set = function (key, value) {
  this.cache[key] = value;
};

module.exports = Cache;
