"use strict";

require("./sc");

describe("SCScript", function() {
  it("should call given function with sc.lang.$SC", function() {
    var spy = sinon.spy();
    sc.SCScript(spy);
    expect(spy).to.be.calledWith(sc.lang.$SC);
  });
  describe(".install", function() {
    it("should call given function with sc", function() {
      var installer = sinon.spy();
      sc.SCScript.install(installer);
      expect(installer).to.be.calledWith(sc);
    });
  });
  describe(".VERSION", function() {
    it("should be exists", function() {
      expect(sc.SCScript.VERSION).to.be.a("string");
    });
  });
});
