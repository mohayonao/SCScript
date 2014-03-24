"use strict";

require("./Symbol");

var $SC = sc.lang.$SC;

describe("class Symbol", function() {
  var Symbol;
  before(function() {
    Symbol = $SC.Class("Symbol");
  });
  describe("$SC.Symbol", function() {
    it("should return instance of Symbol with defaults", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.Symbol("sym");
      var test = instance.isMemberOf(Symbol);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal("sym");

      spy.restore();
    }));
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
  describe("#__tag__", function() {
    it("should return TAG_SYM", function() {
      var test = $SC.Symbol("sym").__tag__();
      expect(test).to.be.equal(sc.C.TAG_SYM);
    });
  });
  describe("#__str__", function() {
    it("should return JavaScript string", function() {
      var test = $SC.Symbol("sym").__str__();
      expect(test).to.be.equal("sym");
    });
  });
});
