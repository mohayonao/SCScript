"use strict";

require("./Char");

var $SC = sc.lang.$SC;

describe("class Char", function() {
  var Char;
  before(function() {
    Char = $SC.Class("Char");
  });
  describe("$SC.Char", function() {
    it("should return instance of Char with defaults", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.Char("a");
      var test = instance.isMemberOf(Char);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal("a");

      spy.restore();
    }));
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
  describe("#__tag__", function() {
    it("should return TAG_CHAR", function() {
      var test = $SC.Char("a").__tag__();
      expect(test).to.be.equal(sc.C.TAG_CHAR);
    });
  });
  describe("#__str__", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Char("a").__str__();
      expect(test).to.be.equal("a");
    });
  });
});
