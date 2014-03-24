"use strict";

require("./Ref");

var $SC = sc.lang.$SC;

describe("class Ref", function() {
  var Ref;
  before(function() {
    Ref = $SC.Class("Ref");
  });
  describe(".new", function() {
    it("should return instance of Ref", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Ref.new();
      var test = instance.isMemberOf(Ref);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
