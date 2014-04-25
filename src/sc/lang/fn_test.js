"use strict";

require("./fn");

var fn = sc.lang.fn;

describe("sc.lang.fn", function() {
  it("'a, b, c': call(1, 2) should pass [ 1, 2 ]", function() {
    var instance, spy;

    spy = sinon.spy();
    instance = {
      func: fn(spy, "a, b, c")
    };

    instance.func(1, 2);

    expect(spy).to.be.calledWith(1, 2);
  });
  it("'a, b, c': call(1, { c: 3 }) should pass [ 1, undef, 3 ]", function() {
    var instance, spy;

    spy = sinon.spy();
    instance = {
      func: fn(spy, "a, b, c")
    };

    instance.func(1, { c: 3 });

    expect(spy).to.be.calledWith(1, undefined, 3);
  });
  it("'a, b, c': call(1, { x: 3 }) should pass [ 1, undef, undef ]", function() {
    var instance, spy;

    spy = sinon.spy();
    instance = {
      func: fn(spy, "a, b, c")
    };

    instance.func(1, { x: 3 });

    expect(spy).to.be.calledWith(1, undefined, undefined);
  });
  it("'a, b, *c': call(1, 2, 3, 4, 5) should pass [ 1, 2, [ 3, 4, 5 ] ]", function() {
    var instance, spy;

    spy = sinon.spy();
    instance = {
      func: fn(spy, "a, b, *c")
    };

    instance.func(1, 2, 3, 4, 5);

    expect(spy.args[0][0]).to.equal(1);
    expect(spy.args[0][1]).to.equal(2);
    expect(spy.args[0][2]).to.be.a("SCArray").that.eqls([ 3, 4, 5 ]);
  });
});
