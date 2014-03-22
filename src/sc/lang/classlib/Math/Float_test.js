"use strict";

require("./Float");

var $SC = sc.lang.$SC;

describe("class Float", function() {
  describe("$SC.Float", function() {
    it("should return instance of Float", function() {
      var instance = $SC.Float(0);
      expect(String(instance)).to.be.equal("instance of Float");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.Float(0);
      var b = $SC.Float(0);
      var c = $SC.Float(1);
      expect(a).to.be.equal(b);
      expect(b).to.be.not.equal(c);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Float").new();
      }).to.throw("Float.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript number", function() {
      var test = $SC.Float(2014.0322).js();
      expect(test).to.be.equal(2014.0322);
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_FLOAT", function() {
      var test = $SC.Float(2014.0323).__tag__();
      expect(test).to.be.equal(sc.C.TAG_FLOAT);
    });
  });
});
