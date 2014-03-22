"use strict";

require("./String");

var $SC = sc.lang.$SC;

describe("class String", function() {
  describe("$SC.String", function() {
    it("should return instance of String", function() {
      var instance = $SC.String("str");
      expect(String(instance)).to.be.equal("instance of String");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.String("str0");
      var b = $SC.String("str0");
      var c = $SC.String("str1");
      expect(a).to.be.equal(b);
      expect(b).to.be.not.equal(c);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("String").new();
      }).to.throw("String.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript string", function() {
      var test = $SC.String("str").js();
      expect(test).to.be.equal("str");
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_STR", function() {
      var test = $SC.String("str").__tag__();
      expect(test).to.be.equal(sc.C.TAG_STR);
    });
  });
  describe("#__str__", function() {
    it("should return JavaScript string", function() {
      var test = $SC.String("str").__str__();
      expect(test).to.be.equal("str");
    });
  });
});
