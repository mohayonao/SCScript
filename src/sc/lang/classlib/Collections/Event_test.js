"use strict";

require("./Event");

var $SC = sc.lang.$SC;

describe("SCEvent", function() {
  var SCEvent;
  before(function() {
    SCEvent = $SC.Class("Event");
    this.createInstance = function() {
      return SCEvent.new();
    };
  });
  it("#valueOf", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.valueOf();
    expect(test).to.be.a("JSObject").that.eqls({});
  });
  it.skip(".default", function() {
  });
  it.skip(".silent", function() {
  });
  it.skip(".addEventType", function() {
  });
  it.skip("#next", function() {
  });
  it.skip("#delta", function() {
  });
  it.skip("#play", function() {
  });
  it.skip("#isRest", function() {
  });
  it.skip("#isPlaying_", function() {
  });
  it.skip("#isRunning_", function() {
  });
  it.skip("#playAndDelta", function() {
  });
  it.skip("#synchWithQuant", function() {
  });
  it.skip("#asControlInput", function() {
  });
  it.skip("#asUGenInput", function() {
  });
  it.skip("#printOn", function() {
  });
  it.skip("#storeOn", function() {
  });
  it.skip("#$initClass", function() {
  });
  it.skip("#$makeDefaultSynthDef", function() {
  });
  it.skip("#$makeParentEvents", function() {
  });
});
