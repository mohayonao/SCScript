"use strict";

require("./Stream");

var $SC = sc.lang.$SC;

describe("class Stream", function() {
  it.skip("write later", function() {
  });
});
describe("class PauseStream", function() {
  it.skip("write later", function() {
  });
});
describe("class Task", function() {
  describe(".new", function() {
    it("should return instance", function() {
      var test = $SC.Class("Task").new(10, 20);
      // console.log(test);
      test = null;
    });
  });
});
