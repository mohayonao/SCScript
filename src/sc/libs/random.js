(function(sc) {
  "use strict";

  require("./libs");

  var random = {};

  function RandGen(seed) {
    this.setSeed(seed);
  }

  RandGen.prototype.setSeed = function(seed) {
    if (typeof seed !== "number") {
      seed = Date.now();
    }
    seed += ~(seed <<  15);
    seed ^=   seed >>> 10;
    seed +=   seed <<  3;
    seed ^=   seed >>> 6;
    seed += ~(seed <<  11);
    seed ^=   seed >>> 16;

    this.x = 1243598713 ^ seed;
    this.y = 3093459404 ^ seed;
    this.z = 1821928721 ^ seed;

    return this;
  };

  RandGen.prototype.trand = function() {
    this.x = ((this.x & 4294967294) << 12) ^ (((this.x << 13) ^ this.x) >>> 19);
    this.y = ((this.y & 4294967288) <<  4) ^ (((this.y <<  2) ^ this.y) >>> 25);
    this.z = ((this.z & 4294967280) << 17) ^ (((this.z <<  3) ^ this.z) >>> 11);
    return this.x ^ this.y ^ this.z;
  };

  RandGen.prototype.next = function() {
    return (this.trand() >>> 0) / 4294967296;
  };

  RandGen.prototype.RandGen = RandGen;

  random = {
    RandGen: RandGen,
    current: new RandGen(),
    next: function() {
      return random.current.next();
    },
    setSeed: function(seed) {
      return random.current.setSeed(seed);
    }
  };

  sc.libs.random = random;
})(sc);
