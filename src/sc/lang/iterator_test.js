(function() {
  "use strict";

  require("./iterator");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  describe("sc.lang.iterator", function() {
    describe("iterator", function() {
      it("object$do", function() {
        var iter, $obj = {};

        iter = iterator.object$do($obj);
        expect(iter.next()).to.equal($obj);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("function$while", function() {
        var iter;
        var i = 0, $nil = $.Nil();

        iter = iterator.function$while(
          $$(function() {
            return $.Boolean(i++ < 5);
          })
        );
        expect(iter.next()).to.be.a("JSArray").that.eqls([ $nil, $nil ]);
        expect(iter.next()).to.be.a("JSArray").that.eqls([ $nil, $nil ]);
        expect(iter.next()).to.be.a("JSArray").that.eqls([ $nil, $nil ]);
        expect(iter.next()).to.be.a("JSArray").that.eqls([ $nil, $nil ]);
        expect(iter.next()).to.be.a("JSArray").that.eqls([ $nil, $nil ]);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$do", function() {
        var iter;

        iter = iterator.number$do(
          $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$do(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.number$reverseDo(
          $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$reverseDo(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$for", function() {
        var iter;

        iter = iterator.number$for(
          $.Integer(1), $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$for(
          $.Integer(5), $.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$forBy", function() {
        var iter;

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $.Integer(5), $.Integer(1), $.Integer(-2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(5), $.Integer(0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(1), $.Integer(0)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$forSeries", function() {
        var iter;

        iter = iterator.number$forSeries(
          $.Integer(1), $.Integer(3), $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forSeries(
          $.Integer(5), $.Integer(3), $.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forSeries(
          $.Integer(1), $.Integer(0), $.Integer(3)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$do", function() {
        var iter;

        iter = iterator.integer$do(
          $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$do(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.integer$reverseDo(
          $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$reverseDo(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$for", function() {
        var iter;

        iter = iterator.integer$for(
          $.Integer(1), $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$for(
          $.Integer(5), $.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$forBy", function() {
        var iter;

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $.Integer(5), $.Integer(1), $.Integer(-2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(1), $.Integer(0)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$forSeries", function() {
        var iter;

        iter = iterator.integer$forSeries(
          $.Integer(1), $.Integer(3), $.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forSeries(
          $.Integer(5), $.Integer(3), $.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forSeries(
          $.Integer(1), $.Integer(0), $.Integer(3)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$do", function() {
        var iter;

        iter = iterator.float$do(
          $.Float(5.1)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$do(
          $.Float(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$reverseDo", function() {
        var iter;

        iter = iterator.float$reverseDo(
          $.Float(5.7)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.7, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.7, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.7, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.7, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(0.7, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(-0.3, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$reverseDo(
          $.Float(5.0)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(0.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$reverseDo(
          $.Float(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$for", function() {
        var iter;

        iter = iterator.float$for(
          $.Float(1.5), $.Float(5.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$for(
          $.Float(5.5), $.Float(1.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$forBy", function() {
        var iter;

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(5.5), $.Float(2.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $.Float(5.5), $.Float(1.5), $.Float(-2.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(5.5), $.Float(0.0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(1.5), $.Float(0.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$forSeries", function() {
        var iter;

        iter = iterator.float$forSeries(
          $.Float(1.5), $.Float(3.5), $.Float(5.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forSeries(
          $.Float(5.5), $.Float(3.5), $.Float(1.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forSeries(
          $.Float(1.5), $.Float(0), $.Float(3.5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("array$do", function() {
        var iter;

        iter = iterator.array$do($$([]));
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.array$do($$([ 1, 2, 3, 4 ]));
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("array$reverseDo", function() {
        var iter;

        iter = iterator.array$reverseDo($$([]));
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.array$reverseDo($$([ 1, 2, 3, 4 ]));
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("set$reverseDo", function() {
        var iter;
        var $set = {
          _$array: $$([ null, 1, 2, null, 3, null ])
        };

        iter = iterator.set$do($set);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
    });
    describe("execute", function() {
      it("execute", sinon.test(function() {
        var iter;
        var $function = {
          value: this.spy()
        };

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        iterator.execute(iter, $function);

        expect($function.value).to.callCount(3);
        expect($function.value.args[0][0]).to.be.a("SCInteger").that.equals(1);
        expect($function.value.args[1][0]).to.be.a("SCInteger").that.equals(3);
        expect($function.value.args[2][0]).to.be.a("SCInteger").that.equals(5);

        expect($function.value.args[0][1]).to.be.a("SCInteger").that.equals(0);
        expect($function.value.args[1][1]).to.be.a("SCInteger").that.equals(1);
        expect($function.value.args[2][1]).to.be.a("SCInteger").that.equals(2);
      }));
      it("arguments", sinon.test(function() {
        var iter;
        var i = 0, $function = {
          value: this.spy()
        };

        iter = iterator.function$while(
          $$(function() {
            return $.Boolean(i++ < 3);
          })
        );
        iterator.execute(iter, $function);

        expect($function.value).to.callCount(3);
        expect($function.value.args[0][0]).to.be.a("SCNil");
        expect($function.value.args[1][0]).to.be.a("SCNil");
        expect($function.value.args[2][0]).to.be.a("SCNil");

        expect($function.value.args[0][1]).to.be.a("SCNil");
        expect($function.value.args[1][1]).to.be.a("SCNil");
        expect($function.value.args[2][1]).to.be.a("SCNil");
      }));
      it("loop break", sinon.test(function() {
        var iter;
        var $function = {
          value: this.spy(function($i) {
            if ($i.valueOf() >= 5) {
              return sc.C.LOOP_BREAK;
            }
          })
        };

        iter = iterator.integer$do(
          $.Integer(Infinity)
        );
        iterator.execute(iter, $function);

        expect($function.value).to.callCount(6);
        expect($function.value.args[0][0]).to.be.a("SCInteger").that.equals(0);
      }));
    });
  });
})();
