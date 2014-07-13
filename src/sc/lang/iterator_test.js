describe("sc.lang.iterator", function() {
  "use strict";

  var $$ = sc.test.object;
  var $  = sc.lang.$;

  function testTwice(iter, init, test) {
    if (!test) {
      test = init;
      init = null;
    }
    if (init) {
      init();
    }
    test(iter);
    if (init) {
      init();
    }
    test(iter.clone());
  }

  describe("iterator", function() {
    it("object$do", function() {
      var $obj = $$();
      var iter = sc.lang.iterator.object$do($obj);

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $obj, 0 ])._);
        expect(iter.hasNext, 3).to.be.false;
        expect(iter.next() , 4).to.be.null;
      });
    });

    it("function$while", function() {
      var x = 0;
      var iter = sc.lang.iterator.function$while(
        $$(function() {
          return $$(x++ < 5);
        })
      );

      testTwice(iter, function() {
        x = 0;
      }, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 3).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 4).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 5).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 6).to.deep.equal($$([ null, null ])._);
        expect(iter.hasNext, 7).to.be.true; // !!!!!
        expect(iter.next() , 8).to.be.null;
        expect(iter.hasNext, 9).to.be.false;
      });
    });

    it("function$while", function() {
      var iter = sc.lang.iterator.function$while(
        $$(function() {
          return $$(false);
        })
      );

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true; // !!!!!
        expect(iter.next() , 2).to.be.null;
        expect(iter.hasNext, 3).to.be.false;
      });
    });

    it("function$loop", function() {
      var iter = sc.lang.iterator.function$loop();

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 3).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 4).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 5).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 6).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 7).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 8).to.deep.equal($$([ null, null ])._);
        expect(iter.next() , 9).to.deep.equal($$([ null, null ])._);
      });
    });

    it("number$do", function() {
      var iter = sc.lang.iterator.number$do($$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 0, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 1, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 2, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 3, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 4, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("number$do neg", function() {
      var iter = sc.lang.iterator.number$do($$(-5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("integer$reverseDo", function() {
      var iter = sc.lang.iterator.number$reverseDo($$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 4, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 2, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 1, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 0, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("number$reverseDo neg", function() {
      var iter = sc.lang.iterator.number$reverseDo($$(-5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("number$for upto", function() {
      var iter = sc.lang.iterator.number$for($$(1), $$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 2, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 4, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 5, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("number$for downto", function() {
      var iter = sc.lang.iterator.number$for($$(5), $$(1));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 4, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 2, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 1, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("number$forBy upto", function() {
      var iter = sc.lang.iterator.number$forBy($$(1), $$(5), $$(2));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("number$forBy downto", function() {
      var iter = sc.lang.iterator.number$forBy($$(5), $$(1), $$(-2));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 1, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("number$forBy step=0", function() {
      var iter = sc.lang.iterator.number$forBy($$(1), $$(5), $$(0));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("number$forBy start=end", function() {
      var iter = sc.lang.iterator.number$forBy($$(1), $$(1), $$(0));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.hasNext, 3).to.be.false;
        expect(iter.next() , 4).to.be.null;
      });
    });

    it("number$forSeries upto", function() {
      var iter = sc.lang.iterator.number$forSeries($$(1), $$(3), $$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("number$forSeries downto", function() {
      var iter = sc.lang.iterator.number$forSeries($$(5), $$(3), $$(1));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next(),  4).to.deep.equal($$([ 1, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next(),  6).to.be.null;
      });
    });

    it("number$forSeries ignore", function() {
      var iter = sc.lang.iterator.number$forSeries($$(1), $$(0), $$(3));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next(),  2).to.be.null;
      });
    });

    it("integer$do", function() {
      var iter = sc.lang.iterator.integer$do($$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 0, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 1, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 2, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 3, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 4, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("integer$do neg", function() {
      var iter = sc.lang.iterator.integer$do($$(-5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("integer$reverseDo", function() {
      var iter = sc.lang.iterator.integer$reverseDo($$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 4, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 2, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 1, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 0, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("integer$reverseDo neg", function() {
      var iter = sc.lang.iterator.integer$reverseDo($$(-5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("integer$for upto", function() {
      var iter = sc.lang.iterator.integer$for($$(1), $$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 2, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 4, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 5, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("integer$for downto", function() {
      var iter = sc.lang.iterator.integer$for($$(5), $$(1));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 4, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 2, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 1, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next(),  8).to.be.null;
      });
    });

    it("integer$forBy upto", function() {
      var iter = sc.lang.iterator.integer$forBy($$(1), $$(5), $$(2));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next(),  6).to.be.null;
      });
    });

    it("integer$forBy downto", function() {
      var iter = sc.lang.iterator.integer$forBy($$(5), $$(1), $$(-2));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next(),  4).to.deep.equal($$([ 1, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("integer$forBy step=0", function() {
      var iter = sc.lang.iterator.integer$forBy($$(1), $$(5), $$(0));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("integer$forBy start=end", function() {
      var iter = sc.lang.iterator.integer$forBy($$(1), $$(1), $$(0));

      testTwice(iter, function(iter) {
        expect(iter.next() , 1).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.hasNext, 2).to.be.false;
        expect(iter.next() , 3).to.be.null;
      });
    });

    it("integer$forSeries", function() {
      var iter = sc.lang.iterator.integer$forSeries($$(1), $$(3), $$(5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next(),  6).to.be.null;
      });
    });

    it("integer$forSeries", function() {
      var iter = sc.lang.iterator.integer$forSeries($$(5), $$(3), $$(1));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 1, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("integer$forSeries", function() {
      var iter = sc.lang.iterator.integer$forSeries($$(1), $$(0), $$(3));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("float$do", function() {
      var iter = sc.lang.iterator.float$do($$(5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $.Float(0.0), 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ $.Float(1.0), 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ $.Float(2.0), 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ $.Float(3.0), 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ $.Float(4.0), 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("float$do neg", function() {
      var iter = sc.lang.iterator.float$do($$(-5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("float$reverseDo", function() {
      var iter = sc.lang.iterator.float$reverseDo($$(5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([  4.5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([  3.5, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([  2.5, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([  1.5, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([  0.5, 4 ])._);
        expect(iter.next() , 7).to.deep.equal($$([ -0.5, 5 ])._);
        expect(iter.hasNext, 8).to.be.false;
        expect(iter.next() , 9).to.be.null;
      });
    });

    it("float$reverseDo", function() {
      var iter = sc.lang.iterator.float$reverseDo($$(5.0));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $.Float(4.0), 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ $.Float(3.0), 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ $.Float(2.0), 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ $.Float(1.0), 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ $.Float(0.0), 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("float$reverseDo neg", function() {
      var iter = sc.lang.iterator.float$reverseDo($$(-5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("float$for", function() {
      var iter = sc.lang.iterator.float$for($$(1.5), $$(5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1.5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 2.5, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3.5, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 4.5, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 5.5, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("float$for", function() {
      var iter = sc.lang.iterator.float$for($$(5.5), $$(1.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5.5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 4.5, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3.5, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 2.5, 3 ])._);
        expect(iter.next() , 6).to.deep.equal($$([ 1.5, 4 ])._);
        expect(iter.hasNext, 7).to.be.false;
        expect(iter.next() , 8).to.be.null;
      });
    });

    it("float$forBy upto", function() {
      var iter = sc.lang.iterator.float$forBy($$(1.5), $$(5.5), $$(2.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $.Float(1.5), 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ $.Float(4.0), 1 ])._);
        expect(iter.hasNext, 4).to.be.false;
        expect(iter.next() , 5).to.be.null;
      });
    });

    it("float$forBy downto", function() {
      var iter = sc.lang.iterator.float$forBy($$(5.5), $$(1.5), $$(-2.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $.Float(5.5), 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ $.Float(3.0), 1 ])._);
        expect(iter.hasNext, 4).to.be.false;
        expect(iter.next() , 5).to.be.null;
      });
    });

    it("float$forBy step=0", function() {
      var iter = sc.lang.iterator.float$forBy($$(1.5), $$(5.5), $$(0));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("float$forBy start=end", function() {
      var iter = sc.lang.iterator.float$forBy($$(1.5), $$(1.5), $$(0.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ $.Float(1.5), 0 ])._);
        expect(iter.hasNext, 3).to.be.false;
        expect(iter.next() , 4).to.be.null;
      });
    });

    it("float$forSeries upto", function() {
      var iter = sc.lang.iterator.float$forSeries($$(1.5), $$(3.5), $$(5.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1.5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3.5, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 5.5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("float$forSeries downto", function() {
      var iter = sc.lang.iterator.float$forSeries($$(5.5), $$(3.5), $$(1.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 5.5, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3.5, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 1.5, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });

    it("float$forSeries step=0", function() {
      var iter = sc.lang.iterator.float$forSeries($$(1.5), $$(0), $$(3.5));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("array$do", function() {
      var iter = sc.lang.iterator.array$do($$([ 1, 2, 3, 4 ]));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 2, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 4, 3 ])._);
        expect(iter.hasNext, 6).to.be.false;
        expect(iter.next() , 7).to.be.null;
      });
    });

    it("array$do empty", function() {
      var iter = sc.lang.iterator.array$do($$([]));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("array$reverseDo", function() {
      var iter = sc.lang.iterator.array$reverseDo($$([ 1, 2, 3, 4 ]));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 4, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 3, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 2, 2 ])._);
        expect(iter.next() , 5).to.deep.equal($$([ 1, 3 ])._);
        expect(iter.hasNext, 6).to.be.false;
        expect(iter.next() , 7).to.be.null;
      });
    });

    it("array$reverseDo empty", function() {
      var iter = sc.lang.iterator.array$reverseDo($$([]));

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.false;
        expect(iter.next() , 2).to.be.null;
      });
    });

    it("set$reverseDo", function() {
      var $set = { _$array: $$([ null, 1, 2, null, 3, null ]) };
      var iter = sc.lang.iterator.set$do($set);

      testTwice(iter, function(iter) {
        expect(iter.hasNext, 1).to.be.true;
        expect(iter.next() , 2).to.deep.equal($$([ 1, 0 ])._);
        expect(iter.next() , 3).to.deep.equal($$([ 2, 1 ])._);
        expect(iter.next() , 4).to.deep.equal($$([ 3, 2 ])._);
        expect(iter.hasNext, 5).to.be.false;
        expect(iter.next() , 6).to.be.null;
      });
    });
  });

  describe("execute", function() {
    it("execute", sinon.test(function() {
      var spy = this.spy();
      var $function = $$(spy);
      var iter = sc.lang.iterator.integer$forBy($$(1), $$(5), $$(2));

      sc.lang.iterator.execute(iter, $function);
      expect(spy).to.callCount(3);
      expect(spy.args[0], 1).to.deep.equal($$([ 1, 0 ])._);
      expect(spy.args[1], 2).to.deep.equal($$([ 3, 1 ])._);
      expect(spy.args[2], 3).to.deep.equal($$([ 5, 2 ])._);
    }));

    it("arguments", sinon.test(function() {
      var spy = this.spy();
      var $function = $$(spy);
      var i = 0;
      var iter = sc.lang.iterator.function$while(
        $$(function() {
          return $$(i++ < 3);
        })
      );

      sc.lang.iterator.execute(iter, $function);
      expect(spy).to.callCount(3);
      expect(spy.args[0], 1).to.deep.equal($$([ null, null ])._);
      expect(spy.args[1], 2).to.deep.equal($$([ null, null ])._);
      expect(spy.args[2], 3).to.deep.equal($$([ null, null ])._);
    }));

    it("loop break", sinon.test(function() {
      var spy = this.spy(function($i) {
        if ($i.valueOf() === 2) {
          this.break();
        }
      });
      var $function = $$(spy);
      var iter = sc.lang.iterator.integer$do($$(10));

      sc.lang.iterator.execute(iter, $function);
      expect(spy).to.callCount(3);
      expect(spy.args[0], 1).to.deep.equal($$([ 0, 0 ])._);
      expect(spy.args[1], 2).to.deep.equal($$([ 1, 1 ])._);
      expect(spy.args[2], 3).to.deep.equal($$([ 2, 2 ])._);
    }));

    it("no operation", function() {
      var $function = $$(function() {
        throw new Error("should not be called");
      });
      var iter = sc.lang.iterator.array$do($$([]));

      expect(function() {
        sc.lang.iterator.execute(iter, $function);
      }).to.not.throw("should not be called");
    });
  });

});
