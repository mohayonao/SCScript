"use strict";

require("./Dictionary");

var $SC = sc.lang.$SC;

describe("class Dictionary", function() {
  var Dictionary;
  before(function() {
    Dictionary = $SC.Class("Dictionary");
  });
  describe("$SC.Dictionary", function() {
    it("should return instance of Dictionary", function() {
      var instance = $SC.Dictionary();
      expect(String(instance)).to.be.equal("instance of Dictionary");
    });
  });
  describe(".new", function() {
    it("should return empty Dictionary", function() {
      var test = Dictionary.new("gremlin").js();
      expect(test).to.be.deep.equal({});
    });
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
  it.skip("write later", function() {
  });
});
