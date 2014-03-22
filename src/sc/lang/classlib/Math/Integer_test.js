"use strict";

require("./Integer");

var $SC = sc.lang.$SC;

describe("class Integer", function() {
  describe("$SC.Integer", function() {
    it("should return instance of Integer", function() {
      var instance = $SC.Integer(0);
      expect(String(instance)).to.be.equal("instance of Integer");
    });
    it("should return instance of Float when given is not finite", sinon.test(function() {
      var spy = this.spy($SC, "Float");
      var test = $SC.Integer(Infinity);

      expect(spy).to.be.calledWith(Infinity);
      expect(spy).to.be.returned(test);

      spy.restore();
    }));
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.Integer(0);
      var b = $SC.Integer(0);
      var c = $SC.Integer(1);
      expect(a).to.be.equal(b);
      expect(b).to.be.not.equal(c);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Integer").new();
      }).to.throw("Integer.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript number", function() {
      var test = $SC.Integer(2014).js();
      expect(test).to.be.equal(2014);
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_INT", function() {
      var test = $SC.Integer(2014).__tag__();
      expect(test).to.be.equal(sc.C.TAG_INT);
    });
  });
});
