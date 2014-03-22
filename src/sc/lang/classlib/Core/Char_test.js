"use strict";

require("./Char");

var $SC = sc.lang.$SC;

describe("class Char", function() {
  describe("$SC.Char", function() {
    it("should return instance of Char", function() {
      var instance = $SC.Char("a");
      expect(String(instance)).to.be.equal("instance of Char");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.Char("a");
      var b = $SC.Char("a");
      var c = $SC.Char("b");
      expect(a).to.be.equal(b);
      expect(b).to.be.not.equal(c);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Char").new();
      }).to.throw("Char.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Char("a").js();
      expect(test).to.be.equal("a");
    });
  });
  describe("#__str__", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Char("a").__str__();
      expect(test).to.be.equal("a");
    });
  });
});
