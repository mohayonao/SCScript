"use strict";

require("./ArrayedCollection");

var $SC = sc.lang.$SC;

describe("class ArrayedCollection", function() {
  var ArrayedCollection;
  before(function() {
    ArrayedCollection = $SC.Class("ArrayedCollection");
  });
  describe(".new", function() {
    it("should return instance of ArrayedCollection", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = ArrayedCollection.new();
      var test = instance.isMemberOf(ArrayedCollection);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});

describe("class RawArray", function() {
  var RawArray;
  before(function() {
    RawArray = $SC.Class("RawArray");
  });
  describe(".new", function() {
    it("should return RawArray instance", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = RawArray.new();
      var test = instance.isMemberOf(RawArray);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
