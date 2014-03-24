"use strict";

require("./Set");

var $SC = sc.lang.$SC;

describe("class Set", function() {
  var Set;
  before(function() {
    Set = $SC.Class("Set");
  });
  describe(".new", function() {
    it("should return instance of Set", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Set.new();
      var test = instance.isMemberOf(Set);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
