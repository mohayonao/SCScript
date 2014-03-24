"use strict";

require("./Collection");

var $SC = sc.lang.$SC;

describe("class Collection", function() {
  var Collection;
  before(function() {
    Collection = $SC.Class("Collection");
  });
  describe(".new", function() {
    it("should return Collection instance", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Collection.new();
      var test = instance.isMemberOf(Collection);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
