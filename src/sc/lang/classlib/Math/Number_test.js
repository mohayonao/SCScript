"use strict";

require("./Number");

var $SC = sc.lang.$SC;

describe("class Number", function() {
  var Number;
  before(function() {
    Number = $SC.Class("Number");
  });
  describe(".new", function() {
    it("should return instance of Number", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Number.new();
      var test = instance.isMemberOf(Number);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
