(function() {
  "use strict";

  require("./iterator");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  describe("sc.lang.iterator", function() {
    describe("iterator", function() {
      it("object$do", function() {
        var $obj = {};
        var iter = iterator.object$do($obj);
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $obj, 0 ])._);
          expect(iter.hasNext, 3).to.be.false;
          expect(iter.next() , 4).to.be.null;
        }
      });
      it("function$while", function() {
        var x = 0;
        var iter = iterator.function$while(
          $$(function() {
            return $$(x++ < 5);
          })
        );
        for (var i = 0; i < 2; i++, x = 0, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ null, null ])._);
          expect(iter.next() , 3).to.eql($$([ null, null ])._);
          expect(iter.next() , 4).to.eql($$([ null, null ])._);
          expect(iter.next() , 5).to.eql($$([ null, null ])._);
          expect(iter.next() , 6).to.eql($$([ null, null ])._);
          expect(iter.hasNext, 7).to.be.true; // !!!!!
          expect(iter.next() , 8).to.be.null;
          expect(iter.hasNext, 9).to.be.false;
        }
      });
      it("function$while", function() {
        var iter = iterator.function$while(
          $$(function() {
            return $$(false);
          })
        );
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true; // !!!!!
          expect(iter.next() , 2).to.be.null;
          expect(iter.hasNext, 3).to.be.false;
        }
      });
      it("number$do", function() {
        var iter = iterator.number$do($$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 0, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 1, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 2, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 3, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 4, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("number$do neg", function() {
        var iter = iterator.number$do($$(-5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("integer$reverseDo", function() {
        var iter = iterator.number$reverseDo($$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 4, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 2, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 1, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 0, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("number$reverseDo neg", function() {
        var iter = iterator.number$reverseDo($$(-5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("number$for upto", function() {
        var iter = iterator.number$for($$(1), $$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 2, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 4, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 5, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("number$for downto", function() {
        var iter = iterator.number$for($$(5), $$(1));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 4, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 2, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 1, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("number$forBy upto", function() {
        var iter = iterator.number$forBy($$(1), $$(5), $$(2));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("number$forBy downto", function() {
        var iter = iterator.number$forBy($$(5), $$(1), $$(-2));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 1, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("number$forBy step=0", function() {
        var iter = iterator.number$forBy($$(1), $$(5), $$(0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("number$forBy start=end", function() {
        var iter = iterator.number$forBy($$(1), $$(1), $$(0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.hasNext, 3).to.be.false;
          expect(iter.next() , 4).to.be.null;
        }
      });
      it("number$forSeries upto", function() {
        var iter = iterator.number$forSeries($$(1), $$(3), $$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("number$forSeries downto", function() {
        var iter = iterator.number$forSeries($$(5), $$(3), $$(1));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next(),  4).to.eql($$([ 1, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next(),  6).to.be.null;
        }
      });
      it("number$forSeries ignore", function() {
        var iter = iterator.number$forSeries($$(1), $$(0), $$(3));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next(),  2).to.be.null;
        }
      });
      it("integer$do", function() {
        var iter = iterator.integer$do($$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 0, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 1, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 2, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 3, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 4, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("integer$do neg", function() {
        var iter = iterator.integer$do($$(-5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("integer$reverseDo", function() {
        var iter = iterator.integer$reverseDo($$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 4, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 2, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 1, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 0, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("integer$reverseDo neg", function() {
        var iter = iterator.integer$reverseDo($$(-5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("integer$for upto", function() {
        var iter = iterator.integer$for($$(1), $$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 2, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 4, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 5, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("integer$for downto", function() {
        var iter = iterator.integer$for($$(5), $$(1));
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.eql($$([ 4, 1 ])._);
        expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.eql($$([ 2, 3 ])._);
        expect(iter.next() , 6).to.eql($$([ 1, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next(),  8).to.be.null;
      });
      it("integer$forBy upto", function() {
        var iter = iterator.integer$forBy($$(1), $$(5), $$(2));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next(),  6).to.be.null;
        }
      });
      it("integer$forBy downto", function() {
        var iter = iterator.integer$forBy($$(5), $$(1), $$(-2));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next(),  4).to.eql($$([ 1, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("integer$forBy step=0", function() {
        var iter = iterator.integer$forBy($$(1), $$(5), $$(0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("integer$forBy start=end", function() {
        var iter = iterator.integer$forBy($$(1), $$(1), $$(0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.next() , 1).to.eql($$([ 1, 0 ])._);
          expect(iter.hasNext, 2).to.be.false;
          expect(iter.next() , 3).to.be.null;
        }
      });
      it("integer$forSeries", function() {
        var iter = iterator.integer$forSeries($$(1), $$(3), $$(5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next(),  6).to.be.null;
        }
      });
      it("integer$forSeries", function() {
        var iter = iterator.integer$forSeries($$(5), $$(3), $$(1));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 1, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("integer$forSeries", function() {
        var iter = iterator.integer$forSeries($$(1), $$(0), $$(3));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("float$do", function() {
        var iter = iterator.float$do($$(5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $.Float(0.0), 0 ])._);
          expect(iter.next() , 3).to.eql($$([ $.Float(1.0), 1 ])._);
          expect(iter.next() , 4).to.eql($$([ $.Float(2.0), 2 ])._);
          expect(iter.next() , 5).to.eql($$([ $.Float(3.0), 3 ])._);
          expect(iter.next() , 6).to.eql($$([ $.Float(4.0), 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("float$do neg", function() {
        var iter = iterator.float$do($$(-5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("float$reverseDo", function() {
        var iter = iterator.float$reverseDo($$(5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([  4.5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([  3.5, 1 ])._);
          expect(iter.next() , 4).to.eql($$([  2.5, 2 ])._);
          expect(iter.next() , 5).to.eql($$([  1.5, 3 ])._);
          expect(iter.next() , 6).to.eql($$([  0.5, 4 ])._);
          expect(iter.next() , 7).to.eql($$([ -0.5, 5 ])._);
          expect(iter.hasNext, 8).to.be.false;
          expect(iter.next() , 9).to.be.null;
        }
      });
      it("float$reverseDo", function() {
        var iter = iterator.float$reverseDo($$(5.0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $.Float(4.0), 0 ])._);
          expect(iter.next() , 3).to.eql($$([ $.Float(3.0), 1 ])._);
          expect(iter.next() , 4).to.eql($$([ $.Float(2.0), 2 ])._);
          expect(iter.next() , 5).to.eql($$([ $.Float(1.0), 3 ])._);
          expect(iter.next() , 6).to.eql($$([ $.Float(0.0), 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("float$reverseDo neg", function() {
        var iter = iterator.float$reverseDo($$(-5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("float$for", function() {
        var iter = iterator.float$for($$(1.5), $$(5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1.5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 2.5, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3.5, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 4.5, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 5.5, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("float$for", function() {
        var iter = iterator.float$for($$(5.5), $$(1.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5.5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 4.5, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3.5, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 2.5, 3 ])._);
          expect(iter.next() , 6).to.eql($$([ 1.5, 4 ])._);
          expect(iter.hasNext, 7).to.be.false;
          expect(iter.next() , 8).to.be.null;
        }
      });
      it("float$forBy upto", function() {
        var iter = iterator.float$forBy($$(1.5), $$(5.5), $$(2.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $.Float(1.5), 0 ])._);
          expect(iter.next() , 3).to.eql($$([ $.Float(4.0), 1 ])._);
          expect(iter.hasNext, 4).to.be.false;
          expect(iter.next() , 5).to.be.null;
        }
      });
      it("float$forBy downto", function() {
        var iter = iterator.float$forBy($$(5.5), $$(1.5), $$(-2.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $.Float(5.5), 0 ])._);
          expect(iter.next() , 3).to.eql($$([ $.Float(3.0), 1 ])._);
          expect(iter.hasNext, 4).to.be.false;
          expect(iter.next() , 5).to.be.null;
        }
      });
      it("float$forBy step=0", function() {
        var iter = iterator.float$forBy($$(1.5), $$(5.5), $$(0));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("float$forBy start=end", function() {
        var iter = iterator.float$forBy($$(1.5), $$(1.5), $$(0.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ $.Float(1.5), 0 ])._);
          expect(iter.hasNext, 3).to.be.false;
          expect(iter.next() , 4).to.be.null;
        }
      });
      it("float$forSeries upto", function() {
        var iter = iterator.float$forSeries($$(1.5), $$(3.5), $$(5.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1.5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3.5, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 5.5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("float$forSeries downto", function() {
        var iter = iterator.float$forSeries($$(5.5), $$(3.5), $$(1.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 5.5, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3.5, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 1.5, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
      it("float$forSeries step=0", function() {
        var iter = iterator.float$forSeries($$(1.5), $$(0), $$(3.5));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("array$do", function() {
        var iter = iterator.array$do($$([ 1, 2, 3, 4 ]));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 2, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 4, 3 ])._);
          expect(iter.hasNext, 6).to.be.false;
          expect(iter.next() , 7).to.be.null;
        }
      });
      it("array$do empty", function() {
        var iter = iterator.array$do($$([]));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("array$reverseDo", function() {
        var iter = iterator.array$reverseDo($$([ 1, 2, 3, 4 ]));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 4, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 3, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 2, 2 ])._);
          expect(iter.next() , 5).to.eql($$([ 1, 3 ])._);
          expect(iter.hasNext, 6).to.be.false;
          expect(iter.next() , 7).to.be.null;
        }
      });
      it("array$reverseDo empty", function() {
        var iter = iterator.array$reverseDo($$([]));
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.false;
          expect(iter.next() , 2).to.be.null;
        }
      });
      it("set$reverseDo", function() {
        var $set = {
          _$array: $$([ null, 1, 2, null, 3, null ])
        };
        var iter = iterator.set$do($set);
        for (var i = 0; i < 2; i++, iter = iter.clone()) {
          expect(iter.hasNext, 1).to.be.true;
          expect(iter.next() , 2).to.eql($$([ 1, 0 ])._);
          expect(iter.next() , 3).to.eql($$([ 2, 1 ])._);
          expect(iter.next() , 4).to.eql($$([ 3, 2 ])._);
          expect(iter.hasNext, 5).to.be.false;
          expect(iter.next() , 6).to.be.null;
        }
      });
    });
    describe("execute", function() {
      it("execute", sinon.test(function() {
        var iter, spy;
        var $function;

        spy = this.spy();
        $function = $$(spy);

        iter = iterator.integer$forBy($$(1), $$(5), $$(2));
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0], 1).to.eql($$([ 1, 0 ])._);
        expect(spy.args[1], 2).to.eql($$([ 3, 1 ])._);
        expect(spy.args[2], 3).to.eql($$([ 5, 2 ])._);
      }));
      it("arguments", sinon.test(function() {
        var iter, spy;
        var i = 0;
        var $function;

        spy = this.spy();
        $function = $$(spy);

        iter = iterator.function$while(
          $$(function() {
            return $$(i++ < 3);
          })
        );
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0], 1).to.eql($$([ null, null ])._);
        expect(spy.args[1], 2).to.eql($$([ null, null ])._);
        expect(spy.args[2], 3).to.eql($$([ null, null ])._);
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

        iter = iterator.integer$do($$(100));
        iterator.execute(iter, $function);

        expect(spy).to.callCount(3);
        expect(spy.args[0], 1).to.eql($$([ 0, 0 ])._);
        expect(spy.args[1], 2).to.eql($$([ 1, 1 ])._);
        expect(spy.args[2], 3).to.eql($$([ 2, 2 ])._);
      }));
      it("no operation", function() {
        var iter;
        var $function = $$(function() {
          throw new Error("should not be called");
        });

        iter = iterator.array$do($$([]));
        expect(function() {
          iterator.execute(iter, $function);
        }).to.not.throw("should not be called");
      });
    });
  });
})();
