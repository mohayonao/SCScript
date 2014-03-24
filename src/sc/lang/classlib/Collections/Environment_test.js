"use strict";

require("./Environment");

var $SC = sc.lang.$SC;

describe("class Environment", function() {
  var Environment;
  before(function() {
    Environment = $SC.Class("Environment");
  });
  describe(".new", function() {
    it("should return instance of Environment", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Environment.new();
      var test = instance.isMemberOf(Environment);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal({});

      spy.restore();
    }));
  });
});
