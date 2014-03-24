"use strict";

require("./AbstractFunction");

var $SC = sc.lang.$SC;

describe("class AbstractFunction", function() {
  var AbstractFunction;
  before(function() {
    AbstractFunction = $SC.Class("AbstractFunction");
  });
  describe(".new", function() {
    it("should return instance of AbstractFunction", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = AbstractFunction.new();
      var test = instance.isMemberOf(AbstractFunction);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });

});
