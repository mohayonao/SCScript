"use strict";

require("./Nil");

var $SC = sc.lang.$SC;

describe("class Nil", function() {
  describe("$SC.Nil", function() {
    it("should return instance of Nil", function() {
      var instance = $SC.Nil();
      expect(String(instance)).to.be.equal("instance of Nil");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.Nil();
      var b = $SC.Nil();
      expect(a).to.be.equal(b);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Nil").new();
      }).to.throw("Nil.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript null", function() {
      var test = $SC.Nil().js();
      expect(test).to.be.equal(null);
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_NIL", function() {
      var test = $SC.Nil().__tag__();
      expect(test).to.be.equal(sc.C.TAG_NIL);
    });
  });
});
