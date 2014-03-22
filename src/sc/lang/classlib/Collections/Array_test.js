"use strict";

require("./Array");

var $SC = sc.lang.$SC;

describe("class Array", function() {
  var Array;
  before(function() {
    Array = $SC.Class("Array");
  });
  describe("$SC.Array", function() {
    it("should return instance of Array", function() {
      var instance = $SC.Array();
      expect(String(instance)).to.be.equal("instance of Array");
    });
  });
  describe(".new", function() {
    it("should return empty Array", function() {
      var test = Array.new("gremlin").js();
      expect(test).to.be.deep.equal([]);
    });
  });
  describe("#js", function() {
    it("should return JavaScript array", function() {
      var list = [ "freq", 440 ];
      var test = $SC.Array(list).js();
      expect(test).to.be.equal(list);
    });
  });
});
