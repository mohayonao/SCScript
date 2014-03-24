"use strict";

require("./Event");

var $SC = sc.lang.$SC;

describe("class Event", function() {
  var Event;
  before(function() {
    Event = $SC.Class("Event");
  });
  describe(".new", function() {
    it("should return instance of Event", sinon.test(function() {
      var spy = this.spy($SC, "Boolean");
      var instance = Event.new();
      var test = instance.isMemberOf(Event);

      expect(spy).to.be.calledWith(true);
      expect(spy).to.be.returned(test);

      expect(instance.js()).to.be.deep.equal({});

      spy.restore();
    }));
  });
});
