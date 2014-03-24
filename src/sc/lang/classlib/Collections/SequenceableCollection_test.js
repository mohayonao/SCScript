"use strict";

require("./SequenceableCollection");

var $SC = sc.lang.$SC;

describe("class SequenceableCollection", function() {
  var SequenceableCollection;
  before(function() {
    SequenceableCollection = $SC.Class("SequenceableCollection");
  });
  describe(".new", function() {
    it("should return instance of SequenceableCollection", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = SequenceableCollection.new();
      var test = instance.isMemberOf(SequenceableCollection);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
