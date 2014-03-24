"use strict";

require("./Thread");

var $SC = sc.lang.$SC;

describe("class Thread", function() {
  var Thread;
  before(function() {
    Thread = $SC.Class("Thread");
  });
  describe(".new", function() {
    it("should return instance of Thread", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Thread.new();
      var test = instance.isMemberOf(Thread);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
describe("class Routine", function() {
  var Routine;
  before(function() {
    Routine = $SC.Class("Routine");
  });
  describe(".new", function() {
    it("should return instance of Routine", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Routine.new();
      var test = instance.isMemberOf(Routine);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.equal(instance);

      spy.restore();
    }));
  });
});
