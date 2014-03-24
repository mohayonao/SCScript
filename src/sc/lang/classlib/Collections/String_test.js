"use strict";

require("./String");

var $SC = sc.lang.$SC;

describe("class String", function() {
  var String;
  before(function() {
    String = $SC.Class("String");
  });
  describe("$SC.String", function() {
    it("should return instance of String with defaults", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.String("str");
      var test = instance.isMemberOf(String);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal("str");

      spy.restore();
    }));
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
