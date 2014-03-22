"use strict";

require("./Object");

var $SC = sc.lang.$SC;

describe("class Object", function() {
  var Object;
  before(function() {
    Object = $SC.Class("Object");
  });
  describe("#js", function() {
    it("should return self", function() {
      var instance = Object.new();
      var test = instance.js();
    expect(test).to.be.equal(instance);
    });
  });
  describe("#__num__", function() {
    it("should return 0 as JavaScript number", function() {
      var test = Object.new().__num__();
      expect(test).to.be.equal(0);
    });
  });
  describe("#__str__", function() {
    it("should return class name as JavaScript string", function() {
      var test = Object.new().__str__();
      expect(test).to.be.equal("Object");
    });
  });
});
