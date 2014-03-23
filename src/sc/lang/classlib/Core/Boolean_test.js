"use strict";

require("./Boolean");

var $SC = sc.lang.$SC;

describe("class Boolean", function() {
  describe("$SC.Boolean", function() {
    it("should return instance of True when given true", sinon.test(function() {
      var spy = this.spy($SC, "True");
      var test = $SC.Boolean(true);

      expect(spy).to.be.called;
      expect(spy).to.be.returned(test);

      spy.restore();
    }));
    it("should return instance of False when given false", sinon.test(function() {
      var spy = this.spy($SC, "False");
      var test = $SC.Boolean(false);

      expect(spy).to.be.called;
      expect(spy).to.be.returned(test);

      spy.restore();
    }));
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("Boolean").new();
      }).to.throw("Boolean.new is illegal");
    });
  });
});
describe("class True", function() {
  describe("$SC.True", function() {
    it("should return instance of True", function() {
      var instance = $SC.True();
      expect(String(instance)).to.be.equal("instance of True");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.True();
      var b = $SC.True();
      expect(a).to.be.equal(b);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("True").new();
      }).to.throw("True.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript boolean", function() {
      var test = $SC.True().js();
      expect(test).to.be.equal(true);
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_TRUE", function() {
      var test = $SC.True().__tag__();
      expect(test).to.be.equal(sc.C.TAG_TRUE);
    });
  });
});
describe("class False", function() {
  describe("$SC.False", function() {
    it("should return instance of False", function() {
      var instance = $SC.False();
      expect(String(instance)).to.be.equal("instance of False");
    });
  });
  describe("instance", function() {
    it("should be shared", function() {
      var a = $SC.False();
      var b = $SC.False();
      expect(a).to.be.equal(b);
    });
  });
  describe(".new", function() {
    it("should throw error", function() {
      expect(function() {
        $SC.Class("False").new();
      }).to.throw("False.new is illegal");
    });
  });
  describe("#js", function() {
    it("should return JavaScript boolean", function() {
      var test = $SC.False().js();
      expect(test).to.be.equal(false);
    });
  });
  describe("#__tag__", function() {
    it("should return TAG_FALSE", function() {
      var test = $SC.False().__tag__();
      expect(test).to.be.equal(sc.C.TAG_FALSE);
    });
  });
});
