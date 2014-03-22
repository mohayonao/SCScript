"use strict";

require("./Symbol");

var $SC = sc.lang.$SC;

describe("class Symbol", function() {
  describe("$SC.Symbol", function() {
    it("should return instance of Symbol", function() {
      var instance = $SC.Symbol("sym");
      expect(String(instance)).to.be.equal("instance of Symbol");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.Symbol("sym0");
      var b = $SC.Symbol("sym0");
      var c = $SC.Symbol("sym1");
      expect(a).to.be.equal(b);
      expect(b).to.be.not.equal(c);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Symbol").new();
      }).to.throw("Symbol.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Symbol("sym").js();
      expect(test).to.be.equal("sym");
    });
  });
  describe("#__str__", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Symbol("sym").__str__();
      expect(test).to.be.equal("sym");
    });
  });
});
