"use strict";

require("./bop");
require("../../../libs/mathlib");

describe("sc.lang.classlib.bop", function() {
  var $SC = sc.lang.$SC;
  var bop = sc.lang.classlib.bop;
  it("(int, int)", function() {
    var func, test;

    func = bop("+", $SC.Integer, $SC.Integer);

    test = func.call($SC.Integer(1), $SC.Integer(2));
    expect(test).to.be.a("SCInteger").that.equals(3);

    test = func.call($SC.Integer(1), $SC.Float(2));
    expect(test).to.be.a("SCInteger").that.equals(3);

    test = func.call($SC.Float(1), $SC.Integer(2));
    expect(test).to.be.a("SCInteger").that.equals(3);

    test = func.call($SC.Float(1), $SC.Float(2));
    expect(test).to.be.a("SCInteger").that.equals(3);
  });
  it("(int, float)", function() {
    var func, test;

    func = bop("+", $SC.Integer, $SC.Float);

    test = func.call($SC.Integer(1), $SC.Integer(2));
    expect(test).to.be.a("SCInteger").that.equals(3);

    test = func.call($SC.Integer(1), $SC.Float(2));
    expect(test).to.be.a("SCFloat").that.equals(3);

    test = func.call($SC.Float(1), $SC.Integer(2));
    expect(test).to.be.a("SCInteger").that.equals(3);

    test = func.call($SC.Float(1), $SC.Float(2));
    expect(test).to.be.a("SCFloat").that.equals(3);
  });
  it("(float, float)", function() {
    var func, test;

    func = bop("+", $SC.Float, $SC.Float);

    test = func.call($SC.Integer(1), $SC.Integer(2));
    expect(test).to.be.a("SCFloat").that.equals(3);

    test = func.call($SC.Integer(1), $SC.Float(2));
    expect(test).to.be.a("SCFloat").that.equals(3);

    test = func.call($SC.Float(1), $SC.Integer(2));
    expect(test).to.be.a("SCFloat").that.equals(3);

    test = func.call($SC.Float(1), $SC.Float(2));
    expect(test).to.be.a("SCFloat").that.equals(3);
  });
  it("(others)", function() {
    var func, test;

    func = bop("+", $SC.Float, $SC.Float);

    test = func.call($SC.Integer(1), $SC.Array([ $SC.Integer(2) ]));
    expect(test).to.be.a("SCArray").that.eqls([ 3 ]);
  });
});
