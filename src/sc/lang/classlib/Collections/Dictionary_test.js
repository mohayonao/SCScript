"use strict";

require("./Dictionary");

var $SC = sc.lang.$SC;

describe("class Dictionary", function() {
  var Dictionary;
  before(function() {
    Dictionary = $SC.Class("Dictionary");
  });
  describe("$SC.Dictionary", function() {
    it("should return instance of Dictionary with defaults", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = $SC.Dictionary({ a: 1, b: 2, c: 3 });

      var test = instance.isMemberOf(Dictionary);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal({ a: 1, b: 2, c: 3 });

      spy.restore();
    }));
  });
  describe(".new", function() {
    it("should return instance of Dictionary", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Dictionary.new();
      var test = instance.isMemberOf(Dictionary);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal({});

      spy.restore();
    }));
  });
  describe("#js", function() {
    it("should return JavaScript object", function() {
      var dict = { freq: 440 };
      var test = $SC.Dictionary(dict).js();
      expect(test).to.be.equal(dict);
    });
  });
});

describe("class IdentityDictionary", function() {
  var IdentityDictionary;
  before(function() {
    IdentityDictionary = $SC.Class("IdentityDictionary");
  });
  describe(".new", function() {
    it("should return empty IdentityDictionary", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = IdentityDictionary.new();
      var test = instance.isMemberOf(IdentityDictionary);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal({});

      spy.restore();
    }));
  });
});
