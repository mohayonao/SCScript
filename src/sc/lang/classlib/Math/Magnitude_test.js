"use strict";

require("./Magnitude");

var $SC = sc.lang.$SC;

describe("class Magnitude", function() {
  var Magnitude;
  before(function() {
    Magnitude = $SC.Class("Magnitude");
  });
  describe(".new", function() {
    it("should return instance of Magnitude", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Magnitude.new();
      var test = instance.isMemberOf(Magnitude);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
