"use strict";

require("./Function");

var $SC = sc.lang.$SC;

describe("class Function", function() {
  var Function;
  before(function() {
    Function = $SC.Class("Function");
  });
  describe("$SC.Function", function() {
    it("should return instance of Function", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.Function(function() {});
      var test = instance.isMemberOf(Function);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.a("function");

      spy.restore();
    }));
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
