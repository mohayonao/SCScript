"use strict";

require("./Array");

var $SC = sc.lang.$SC;

describe("class Array", function() {
  var Array;
  before(function() {
    Array = $SC.Class("Array");
  });
  describe("$SC.Array", function() {
    it("should return instance of Array with defaults", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.Array([ 1, 2, 3 ]);
      var test = instance.isMemberOf(Array);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal([ 1, 2, 3 ]);

      spy.restore();
    }));
  });
  describe(".new", function() {
    it("should return instance of Array", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Array.new();
      var test = instance.isMemberOf(Array);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal([]);

      spy.restore();
    }));
  });
  describe("#js", function() {
    it("should return JavaScript array", function() {
      var list = [ "freq", 440 ];
      var test = $SC.Array(list).js();
      expect(test).to.be.equal(list);
    });
  });
});
