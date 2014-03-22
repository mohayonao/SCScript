"use strict";

require("./Function");

var $SC = sc.lang.$SC;

describe("class Function", function() {
  describe("$SC.Function", function() {
    it("should return instance of Function", function() {
      var instance = $SC.Function(function() {});
      expect(String(instance)).to.be.equal("instance of Function");
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Function").new();
      }).to.throw("Function.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript function", function() {
      var func = function() {};
      var test = $SC.Function(func).js();
      expect(test).to.be.equal(func);
    });
  });
});
