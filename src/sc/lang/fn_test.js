describe("sc.lang.fn", function() {
  "use strict";

  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var $nil = $.nil;

  describe("transducer", function() {
    it("empty", function() {
      var transduce = sc.lang.fn.compile(null);
      var args = transduce([ 1, 2, 3 ]);
      expect(args).to.eql([ 1, 2, 3 ]);
    });
    it("default args", function() {
      var transduce = sc.lang.fn.compile(
        "a; b=nil; c=true; d=false; e=0; f=0.0; g=inf; h=-inf; i=\\symbol; j=$j"
      );
      var args = transduce([]);

      expect(args).to.deep.equal($$([
        null, null, true, false, 0, $.Float(0.0), Infinity, -Infinity, "\\symbol", "$j"
      ])._);
    });
    it("default args (list)", function() {
      var transduce = sc.lang.fn.compile("a=[ 0, 1, 2 ]");
      var args = transduce([]);

      expect(args).to.deep.equal($$([ [ 0, 1, 2 ] ])._);
    });
  });

  it("default arguments", function() {
    var spy = sinon.spy();
    var instance = {
      func: sc.lang.fn(
        spy, "a; b=nil; c=true; d=false; e=0; f=0.0; g=inf; h=-inf; i=\\symbol; j=$j"
      )
    };

    instance.func(null, null, null, null);

    expect(spy.args[0]).to.deep.equal($$([
      null, null, true, false, 0, $.Float(0.0), Infinity, -Infinity, "\\symbol", "$j"
    ])._);
  });

  it("default arguments (list)", function() {
    var spy = sinon.spy();
    var instance = {
      func: sc.lang.fn(
        spy, "a=[ 0, 1, 2 ]"
      )
    };

    instance.func();

    expect(spy.args[0]).to.deep.equal($$([ [ 0, 1, 2 ] ])._);
  });

  it("meta data", function() {
    var func = sc.lang.fn(function() {}, "a=1; b=1.0");

    expect(func._argNames).to.be.a("JSArray").that.deep.equals([ "a", "b" ]);
    expect(func._argVals ).to.be.a("JSArray").that.deep.equals([ $.Integer(1), $.Float(1.0) ]);
  });

  it("'a, b, c': call($arg1, { c: $argC }) should pass [ $arg1, $nil, $argC ]", function() {
    var $arg1 = $$();
    var $argC = $$();
    var $argD = $$();
    var spy = sinon.spy();
    var instance = {
      func: sc.lang.fn(spy, "a; b; c")
    };

    instance.func($arg1, { c: $argC, d: $argD });

    expect(spy).to.be.calledWith($arg1, $nil, $argC);
  });

  it("'*a'", function() {
    var spy = sinon.spy();
    var instance = {
      func: sc.lang.fn(spy, "*a")
    };

    instance.func();

    expect(spy.args[0]).to.deep.equal($$([ [] ])._);
  });

  it("'a, b, *c': call(1, 2, 3, 4, 5) should pass [ 1, 2, [ 3, 4, 5 ] ]", function() {
    var $arg1 = $$();
    var $arg2 = $$();
    var $arg3 = $$();
    var $arg4 = $$();
    var $arg5 = $$();
    var spy = sinon.spy();
    var instance = {
      func: sc.lang.fn(spy, "a; b; *c")
    };

    instance.func($arg1, $arg2, $arg3, $arg4, $arg5);

    expect(spy.args[0]).to.deep.equal($$([ $arg1, $arg2, [ $arg3, $arg4, $arg5 ] ])._);
  });

});
