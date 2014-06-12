(function() {
  "use strict";

  require("./fn");
  require("./klass/utils");

  var $$ = sc.test.object;

  var fn   = sc.lang.fn;
  var $    = sc.lang.$;
  var $nil = sc.lang.klass.utils.$nil;

  describe("sc.lang.fn", function() {
    it("default arguments", function() {
      var instance, spy;

      spy = sinon.spy();
      instance = {
        func: fn(spy, "a; b=nil; c=true; d=false; e=0; f=0.0; g=inf; h=-inf; i=\\symbol; j=$j")
      };

      instance.func(null, null, null, null);

      expect(spy.args[0]).to.eql($$([
        null, null, true, false, 0, $.Float(0.0), Infinity, -Infinity, "\\symbol", "$j"
      ])._);
    });
    it("default arguments (list)", function() {
      var instance, spy;

      spy = sinon.spy();
      instance = {
        func: fn(spy, "a=[ 0, 1, 2 ]")
      };

      instance.func();

      expect(spy.args[0]).to.eql($$([ [ 0, 1, 2 ] ])._);
    });
    it("meta data", function() {
      var func;

      func = fn(function() {}, "a=1; b=1.0");

      expect(func._argNames).to.be.a("JSArray").that.eqls([ "a", "b" ]);
      expect(func._argVals ).to.be.a("JSArray").that.eqls([ $.Integer(1), $.Float(1.0) ]);
    });
    it("'a, b, c': call($arg1, { c: $argC }) should pass [ $arg1, $nil, $argC ]", function() {
      var instance, spy;
      var $arg1, $argC, $argD;

      $arg1 = $$();
      $argC = $$();
      $argD = $$();

      spy = sinon.spy();
      instance = {
        func: fn(spy, "a; b; c")
      };

      instance.func($arg1, { c: $argC, d: $argD });

      expect(spy).to.be.calledWith($arg1, $nil, $argC);
    });
    it("'*a'", function() {
      var instance, spy;

      spy = sinon.spy();
      instance = {
        func: fn(spy, "*a")
      };

      instance.func();

      expect(spy.args[0]).to.eql($$([ [] ])._);
    });
    it("'a, b, *c': call(1, 2, 3, 4, 5) should pass [ 1, 2, [ 3, 4, 5 ] ]", function() {
      var instance, spy;
      var $arg1, $arg2, $arg3, $arg4, $arg5;

      $arg1 = $$();
      $arg2 = $$();
      $arg3 = $$();
      $arg4 = $$();
      $arg5 = $$();

      spy = sinon.spy();
      instance = {
        func: fn(spy, "a; b; *c")
      };

      instance.func($arg1, $arg2, $arg3, $arg4, $arg5);

      expect(spy.args[0]).to.eql($$([ $arg1, $arg2, [ $arg3, $arg4, $arg5 ] ])._);
    });
  });
})();
