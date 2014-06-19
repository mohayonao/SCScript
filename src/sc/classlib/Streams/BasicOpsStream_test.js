(function() {
  "use strict";

  require("./BasicOpsStream");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var SCRoutine;

  function arrayToFuncStream() {
    var args = arguments, i = 0, j = 0;
    return $("FuncStream").new($$(function() {
      var item = args[i][j++];
      return typeof item !== "undefined" ? $$(item) : undefined;
    }), $$(function() {
      i = (i + 1) % args.length;
      j = 0;
      return $.Nil();
    }));
  }

  function arrayToRoutine(array) {
    return SCRoutine.new($$(function() {
      return $$(array).do($$(function($_) {
        return $_.yield();
      }));
    }));
  }

  describe("SCUnaryOpStream", function() {
    var SCUnaryOpStream;
    before(function() {
      SCUnaryOpStream = $("UnaryOpStream");
      SCRoutine       = $("Routine");
      this.createInstance = function(op, $stream) {
        return $stream.composeUnaryOp($.Symbol(op));
      };
    });
    it("#next / #reset", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) }.neg
      */
      var r = this.createInstance("neg", arrayToRoutine([ 1, 2, 3 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(-1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(-2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(-3);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.equal(r);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(-1);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(-2);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(-3);
      expect(r.next() , 9).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpStream", function() {
    var SCBinaryOpStream;
    before(function() {
      SCBinaryOpStream = $("BinaryOpStream");
      SCRoutine        = $("Routine");
      this.createInstance = function(op, $stream, $argStream) {
        return $stream.composeBinaryOp($.Symbol(op), $argStream);
      };
    });
    it("#next / #reset case1", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20 ].do(_.yield) }
      */
      var r = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20 ])
      );

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(11);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(22);
      expect(r.next() , 3).to.be.a("SCNil");
      expect(r.reset(), 4).to.equal(r);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(11);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(22);
      expect(r.next() , 6).to.be.a("SCNil");
    });
    it("#next / #reset case2", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20, 30, 40 ].do(_.yield) }
      */
      var r = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20, 30, 40 ])
      );

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(11);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(22);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(33);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.equal(r);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(11);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(22);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(33);
      expect(r.next() , 9).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpXStream", function() {
    var SCBinaryOpXStream;
    before(function() {
      SCBinaryOpXStream = $("BinaryOpXStream");
      SCRoutine         = $("Routine");
      this.createInstance = function(op, $stream, $argStream) {
        return $stream.composeBinaryOp($.Symbol(op), $argStream, $$("\\x"));
      };
    });
    it("#next / #reset case1", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20 ].do(_.yield) }
      */
      var r = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20 ])
      );

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(11);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(21);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(12);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(22);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(13);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(23);
      expect(r.next() , 7).to.be.a("SCNil");
      expect(r.reset(), 8).to.equal(r);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(11);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(21);
      expect(r.next() ,11).to.be.a("SCInteger").that.equals(12);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(22);
      expect(r.next() ,13).to.be.a("SCInteger").that.equals(13);
      expect(r.next() ,14).to.be.a("SCInteger").that.equals(23);
      expect(r.next() ,15).to.be.a("SCNil");
    });
    it("#next / #reset case2", sc.test(function() {
      /*
        r = r { [].do(_.yield) } + r { [ 10, 20 ].do(_.yield) }
      */
      var r = this.createInstance(
        "+", arrayToRoutine([]), arrayToRoutine([ 10, 20 ])
      );

      expect(r.next()).to.be.a("SCNil");
    }));
    it("#next / #reset case3", sc.test(function() {
      /*
        r = r { [ 1, 2 ].do(_.yield) } + r { [].do(_.yield) }
      */
      var r = this.createInstance(
        "+", arrayToRoutine([ 1, 2 ]), arrayToRoutine([])
      );

      expect(r.next()).to.be.a("SCNil");
    }));
    it("#next / #reset case4", sc.test(function() {
      var r;
      var $stream1, $stream2;

      $stream1 = arrayToFuncStream([ 1, 2 ]);
      $stream2 = arrayToFuncStream([ 10 ], []);
      r = this.createInstance("+", $stream1, $stream2);

      expect(r.next(), 1).to.be.a("SCInteger").that.equals(11);
      expect(r.next(), 2).to.be.a("SCNil");
    }));
    it.skip("#storeOn", function() {
    });
  });

  describe("SCNAryOpStream", function() {
    var SCNAryOpStream;
    before(function() {
      SCNAryOpStream = $("NAryOpStream");
      SCRoutine      = $("Routine");
      this.createInstance = function(op, $stream, $argList) {
        return $stream.composeNAryOp($.Symbol(op), $argList);
      };
    });
    it("#next / #reset case1", function() {
      /*
        r = r { [ 1, 2, 3, 4, 5 ].do(_.yield) }.clip(2, 4)
      */
      var r = this.createInstance(
        "clip", arrayToRoutine([ 1, 2, 3, 4, 5 ]), $$([ 2, 4 ])
      );

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 6).to.be.a("SCNil");
      expect(r.reset(), 7).to.equal(r);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,11).to.be.a("SCInteger").that.equals(4);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(4);
      expect(r.next() ,13).to.be.a("SCNil");
    });
    it("#next / #reset case2", function() {
      /*
        r = r { [ 10, 20, 30, 40, 50 ].do(_.yield) }.clip(
		      r { [ 0, 10, 100 ].do(_.yield) },
		      r { [ 5, 50, 500 ].do(_.yield) }
	      )
      */
      var r = this.createInstance(
        "clip", arrayToRoutine([ 10, 20, 30, 40, 50 ]), $$([
          arrayToRoutine([ 0, 10, 100 ]),
          arrayToRoutine([ 5, 50, 500 ])
        ])
      );

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(20);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(100);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.equal(r);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(20);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(100);
      expect(r.next() , 9).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });
})();
