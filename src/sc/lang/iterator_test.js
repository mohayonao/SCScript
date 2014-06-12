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
        expect(iter.next(), 1).to.eql($$([ $obj, 0 ])._);
        expect(iter.next(), 2).to.be.null;
        expect(iter.next(), 3).to.be.null;
      });
      it("function$while", function() {
        var iter;
        var i = 0;

        iter = iterator.function$while(
          $$(function() {
            return $.Boolean(i++ < 5);
          })
        );
        expect(iter.next()).to.eql($$([ null, null ])._);
        expect(iter.next()).to.eql($$([ null, null ])._);
        expect(iter.next()).to.eql($$([ null, null ])._);
        expect(iter.next()).to.eql($$([ null, null ])._);
        expect(iter.next()).to.eql($$([ null, null ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("number$do", function() {
        var iter;

        iter = iterator.number$do(
          $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 0, 0 ])._);
        expect(iter.next()).to.eql($$([ 1, 1 ])._);
        expect(iter.next()).to.eql($$([ 2, 2 ])._);
        expect(iter.next()).to.eql($$([ 3, 3 ])._);
        expect(iter.next()).to.eql($$([ 4, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$do(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.number$reverseDo(
          $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 4, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 2, 2 ])._);
        expect(iter.next()).to.eql($$([ 1, 3 ])._);
        expect(iter.next()).to.eql($$([ 0, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$reverseDo(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("number$for", function() {
        var iter;

        iter = iterator.number$for(
          $.Integer(1), $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 2, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.eql($$([ 4, 3 ])._);
        expect(iter.next()).to.eql($$([ 5, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$for(
          $.Integer(5), $.Integer(1)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 4, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.eql($$([ 2, 3 ])._);
        expect(iter.next()).to.eql($$([ 1, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("number$forBy", function() {
        var iter;

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 5, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$forBy(
          $.Integer(5), $.Integer(1), $.Integer(-2)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 1, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(5), $.Integer(0)
        );
        expect(iter.next()).to.be.null;

        iter = iterator.number$forBy(
          $.Integer(1), $.Integer(1), $.Integer(0)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.be.null;
      });
      it("number$forSeries", function() {
        var iter;

        iter = iterator.number$forSeries(
          $.Integer(1), $.Integer(3), $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 5, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$forSeries(
          $.Integer(5), $.Integer(3), $.Integer(1)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 1, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.number$forSeries(
          $.Integer(1), $.Integer(0), $.Integer(3)
        );
        expect(iter.next()).to.be.null;
      });
      it("integer$do", function() {
        var iter;

        iter = iterator.integer$do(
          $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 0, 0 ])._);
        expect(iter.next()).to.eql($$([ 1, 1 ])._);
        expect(iter.next()).to.eql($$([ 2, 2 ])._);
        expect(iter.next()).to.eql($$([ 3, 3 ])._);
        expect(iter.next()).to.eql($$([ 4, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$do(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("integer$reverseDo", function() {
        var iter;

        iter = iterator.integer$reverseDo(
          $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 4, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 2, 2 ])._);
        expect(iter.next()).to.eql($$([ 1, 3 ])._);
        expect(iter.next()).to.eql($$([ 0, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$reverseDo(
          $.Integer(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("integer$for", function() {
        var iter;

        iter = iterator.integer$for(
          $.Integer(1), $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 2, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.eql($$([ 4, 3 ])._);
        expect(iter.next()).to.eql($$([ 5, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$for(
          $.Integer(5), $.Integer(1)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 4, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.eql($$([ 2, 3 ])._);
        expect(iter.next()).to.eql($$([ 1, 4 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("integer$forBy", function() {
        var iter;

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 5, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$forBy(
          $.Integer(5), $.Integer(1), $.Integer(-2)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 1, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(0)
        );
        expect(iter.next()).to.be.null;

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(1), $.Integer(0)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.be.null;
      });
      it("integer$forSeries", function() {
        var iter;

        iter = iterator.integer$forSeries(
          $.Integer(1), $.Integer(3), $.Integer(5)
        );
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 5, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$forSeries(
          $.Integer(5), $.Integer(3), $.Integer(1)
        );
        expect(iter.next()).to.eql($$([ 5, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 1, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.integer$forSeries(
          $.Integer(1), $.Integer(0), $.Integer(3)
        );
        expect(iter.next()).to.be.null;
      });
      it("float$do", function() {
        var iter;

        iter = iterator.float$do(
          $.Float(5.1)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(0, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(2, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$do(
          $.Float(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("float$reverseDo", function() {
        var iter;

        iter = iterator.float$reverseDo(
          $.Float(5.7)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4.7, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.7, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(2.7, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.7, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(0.7, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(-0.3, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$reverseDo(
          $.Float(5.0)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(2.0, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.0, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(0.0, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$reverseDo(
          $.Float(-5)
        );
        expect(iter.next()).to.be.null;
      });
      it("float$for", function() {
        var iter;

        iter = iterator.float$for(
          $.Float(1.5), $.Float(5.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(2.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$for(
          $.Float(5.5), $.Float(1.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(2.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("float$forBy", function() {
        var iter;

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(5.5), $.Float(2.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(4.0, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$forBy(
          $.Float(5.5), $.Float(1.5), $.Float(-2.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.0, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(5.5), $.Float(0.0)
        );
        expect(iter.next()).to.be.null;

        iter = iterator.float$forBy(
          $.Float(1.5), $.Float(1.5), $.Float(0.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.null;
      });
      it("float$forSeries", function() {
        var iter;

        iter = iterator.float$forSeries(
          $.Float(1.5), $.Float(3.5), $.Float(5.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$forSeries(
          $.Float(5.5), $.Float(3.5), $.Float(1.5)
        );
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(5.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(3.5, 1e-6);
        expect(iter.next()[0]).to.be.a("SCFloat").that.is.closeTo(1.5, 1e-6);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;

        iter = iterator.float$forSeries(
          $.Float(1.5), $.Float(0), $.Float(3.5)
        );
        expect(iter.next()).to.be.null;
      });
      it("array$do", function() {
        var iter;

        iter = iterator.array$do($$([]));
        expect(iter.next()).to.be.null;

        iter = iterator.array$do($$([ 1, 2, 3, 4 ]));
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 2, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.eql($$([ 4, 3 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("array$reverseDo", function() {
        var iter;

        iter = iterator.array$reverseDo($$([]));
        expect(iter.next()).to.be.null;

        iter = iterator.array$reverseDo($$([ 1, 2, 3, 4 ]));
        expect(iter.next()).to.eql($$([ 4, 0 ])._);
        expect(iter.next()).to.eql($$([ 3, 1 ])._);
        expect(iter.next()).to.eql($$([ 2, 2 ])._);
        expect(iter.next()).to.eql($$([ 1, 3 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
      it("set$reverseDo", function() {
        var iter;
        var $set = {
          _$array: $$([ null, 1, 2, null, 3, null ])
        };

        iter = iterator.set$do($set);
        expect(iter.next()).to.eql($$([ 1, 0 ])._);
        expect(iter.next()).to.eql($$([ 2, 1 ])._);
        expect(iter.next()).to.eql($$([ 3, 2 ])._);
        expect(iter.next()).to.be.null;
        expect(iter.next()).to.be.null;
      });
    });
    describe("execute", function() {
      it("execute", sinon.test(function() {
        var iter, spy;
        var $function;

        spy = this.spy();
        $function = $$(spy);

        iter = iterator.integer$forBy(
          $.Integer(1), $.Integer(5), $.Integer(2)
        );
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0]).to.eql($$([ 1, 0 ])._);
        expect(spy.args[1]).to.eql($$([ 3, 1 ])._);
        expect(spy.args[2]).to.eql($$([ 5, 2 ])._);
      }));
      it("arguments", sinon.test(function() {
        var iter, spy;
        var i = 0;
        var $function;

        spy = this.spy();
        $function = $$(spy);

        iter = iterator.function$while(
          $$(function() {
            return $.Boolean(i++ < 3);
          })
        );
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0]).to.eql($$([ null, null ])._);
        expect(spy.args[1]).to.eql($$([ null, null ])._);
        expect(spy.args[2]).to.eql($$([ null, null ])._);
      }));
      it("loop break", sinon.test(function() {
        var iter, spy;
        var $function;

        spy = this.spy(function($i) {
          if ($i.valueOf() === 2) {
            this.break();
          }
        });
        $function = $$(spy);

        iter = iterator.integer$do(
          $.Integer(100)
        );
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0]).to.eql($$([ 0, 0 ])._);
        expect(spy.args[1]).to.eql($$([ 1, 1 ])._);
        expect(spy.args[2]).to.eql($$([ 2, 2 ])._);
      }));
    });
  });
})();
