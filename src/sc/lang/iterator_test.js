(function() {
  "use strict";

  require("./iterator");
  require("./dollarSC");

  var $SC = sc.lang.$SC;
  var $ = sc.test.$;
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
        var i = 0, $nil = $SC.Nil();

        iter = iterator.function$while(
          $SC.Function(function() {
            return $SC.Boolean(i++ < 5);
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
          $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$do(
          $SC.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.number$reverseDo(
          $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$reverseDo(
          $SC.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$for", function() {
        var iter;

        iter = iterator.number$for(
          $SC.Integer(1), $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$for(
          $SC.Integer(5), $SC.Integer(1)
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
          $SC.Integer(1), $SC.Integer(5), $SC.Integer(2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $SC.Integer(5), $SC.Integer(1), $SC.Integer(-2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $SC.Integer(1), $SC.Integer(5), $SC.Integer(0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forBy(
          $SC.Integer(1), $SC.Integer(1), $SC.Integer(0)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("number$forSeries", function() {
        var iter;

        iter = iterator.number$forSeries(
          $SC.Integer(1), $SC.Integer(3), $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forSeries(
          $SC.Integer(5), $SC.Integer(3), $SC.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.number$forSeries(
          $SC.Integer(1), $SC.Integer(0), $SC.Integer(3)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$do", function() {
        var iter;

        iter = iterator.integer$do(
          $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$do(
          $SC.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.integer$reverseDo(
          $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(0);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$reverseDo(
          $SC.Integer(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$for", function() {
        var iter;

        iter = iterator.integer$for(
          $SC.Integer(1), $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$for(
          $SC.Integer(5), $SC.Integer(1)
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
          $SC.Integer(1), $SC.Integer(5), $SC.Integer(2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $SC.Integer(5), $SC.Integer(1), $SC.Integer(-2)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $SC.Integer(1), $SC.Integer(5), $SC.Integer(0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forBy(
          $SC.Integer(1), $SC.Integer(1), $SC.Integer(0)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("integer$forSeries", function() {
        var iter;

        iter = iterator.integer$forSeries(
          $SC.Integer(1), $SC.Integer(3), $SC.Integer(5)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forSeries(
          $SC.Integer(5), $SC.Integer(3), $SC.Integer(1)
        );
        expect(iter.next()).to.be.a("SCInteger").that.equals(5);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.integer$forSeries(
          $SC.Integer(1), $SC.Integer(0), $SC.Integer(3)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$do", function() {
        var iter;

        iter = iterator.float$do(
          $SC.Float(5.1)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$do(
          $SC.Float(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$reverseDo", function() {
        var iter;

        iter = iterator.float$reverseDo(
          $SC.Float(5.7)
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
          $SC.Float(5.0)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.0, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(0.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$reverseDo(
          $SC.Float(-5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$for", function() {
        var iter;

        iter = iterator.float$for(
          $SC.Float(1.5), $SC.Float(5.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(2.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$for(
          $SC.Float(5.5), $SC.Float(1.5)
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
          $SC.Float(1.5), $SC.Float(5.5), $SC.Float(2.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $SC.Float(5.5), $SC.Float(1.5), $SC.Float(-2.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $SC.Float(1.5), $SC.Float(5.5), $SC.Float(0.0)
        );
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forBy(
          $SC.Float(1.5), $SC.Float(1.5), $SC.Float(0.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
      });
      it("float$forSeries", function() {
        var iter;

        iter = iterator.float$forSeries(
          $SC.Float(1.5), $SC.Float(3.5), $SC.Float(5.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forSeries(
          $SC.Float(5.5), $SC.Float(3.5), $SC.Float(1.5)
        );
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.float$forSeries(
          $SC.Float(1.5), $SC.Float(0), $SC.Float(3.5)
        );
        expect(iter.next()).to.be.a("JSNull");
      });
      it("array$do", function() {
        var iter;

        iter = iterator.array$do($([]));
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.array$do($([ 1, 2, 3, 4 ]));
        expect(iter.next()).to.be.a("SCInteger").that.equals(1);
        expect(iter.next()).to.be.a("SCInteger").that.equals(2);
        expect(iter.next()).to.be.a("SCInteger").that.equals(3);
        expect(iter.next()).to.be.a("SCInteger").that.equals(4);
        expect(iter.next()).to.be.a("JSNull");
        expect(iter.next()).to.be.a("JSNull");
      });
      it("array$reverseDo", function() {
        var iter;

        iter = iterator.array$reverseDo($([]));
        expect(iter.next()).to.be.a("JSNull");

        iter = iterator.array$reverseDo($([ 1, 2, 3, 4 ]));
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
          _array: $([ null, 1, 2, null, 3, null ])
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
          $SC.Integer(1), $SC.Integer(5), $SC.Integer(2)
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
          $SC.Function(function() {
            return $SC.Boolean(i++ < 3);
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
          $SC.Integer(Infinity)
        );
        iterator.execute(iter, $function);

        expect($function.value).to.callCount(6);
        expect($function.value.args[0][0]).to.be.a("SCInteger").that.equals(0);
      }));
    });
  });
})();
