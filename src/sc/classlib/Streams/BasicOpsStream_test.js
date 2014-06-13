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
      var instance, test;

      /*
        ~instance = {
          r { [ 1, 2, 3 ].do(_.yield) }.neg
        }.value;
      */
      instance = this.createInstance("neg", arrayToRoutine([ 1, 2, 3 ]));

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next(), 4).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next(), 7).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next(), 8).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpStream", function() {
    var SCBinaryOpStream;
    before(function() {
      SCBinaryOpStream = $("BinaryOpStream");
      this.createInstance = function(op, $stream, $argStream) {
        return $stream.composeBinaryOp($.Symbol(op), $argStream);
      };
    });
    it("#next / #reset", function() {
      var instance, test;

      /*
        ~instance = {
        	r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20 ].do(_.yield) }
        }.value;
      */
      instance = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20 ])
      );

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(22);
      expect(instance.next(), 3).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(22);
      expect(instance.next(), 6).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
      var instance;

      /*
        ~instance = {
          r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20, 30, 40 ].do(_.yield) }
        }.value;
      */
      instance = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20, 30, 40 ])
      );

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(22);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(33);
      expect(instance.next(), 4).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpXStream", function() {
    var SCBinaryOpXStream;
    before(function() {
      SCBinaryOpXStream = $("BinaryOpXStream");
      this.createInstance = function(op, $stream, $argStream) {
        return $stream.composeBinaryOp($.Symbol(op), $argStream, $$("\\x"));
      };
    });
    it("#next / #reset", function() {
      var instance, test;

      /*
        ~instance = {
          r { [ 1, 2, 3 ].do(_.yield) } + r { [ 10, 20 ].do(_.yield) }
        }.value;
      */
      instance = this.createInstance(
        "+", arrayToRoutine([ 1, 2, 3 ]), arrayToRoutine([ 10, 20 ])
      );

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(21);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(12);
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(22);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(13);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(23);
      expect(instance.next(), 7).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next(), 8).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 9).to.be.a("SCInteger").that.equals(21);
      expect(instance.next(),10).to.be.a("SCInteger").that.equals(12);
      expect(instance.next(),11).to.be.a("SCInteger").that.equals(22);
      expect(instance.next(),12).to.be.a("SCInteger").that.equals(13);
      expect(instance.next(),13).to.be.a("SCInteger").that.equals(23);
      expect(instance.next(),14).to.be.a("SCNil");
    });
    it("#next / #reset", sc.test(function() {
      var instance;
      var $stream1, $stream2;

      /*
        ~instance = {
          var list1 = []        , i1 = 0;
          var list2 = [ 10, 20 ], i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1 +.x stream2
        }.value;
      */
      $stream1 = arrayToFuncStream([]);
      $stream2 = arrayToFuncStream([ 10, 20 ]);
      instance = this.createInstance("+", $stream1, $stream2);
      // TODO: replace
      // instance = this.createInstance(
      //   "+", arrayToRoutine([]), arrayToRoutine([ 10, 20 ])
      // );

      expect(instance.next()).to.be.a("SCNil");
    }));
    it("#next / #reset", sc.test(function() {
      var instance;
      var $stream1, $stream2;

      /*
        ~instance = {
          var list1 = [ 1, 2 ], i1 = 0;
          var list2 = []      , i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1 +.x stream2
        }.value;
      */
      $stream1 = arrayToFuncStream([ 1, 2 ]);
      $stream2 = arrayToFuncStream([]);
      instance = this.createInstance("+", $stream1, $stream2);
      // TODO: replace
      // instance = this.createInstance(
      //   "+", arrayToRoutine([ 1, 2 ]), arrayToRoutine([])
      // );

      expect(instance.next()).to.be.a("SCNil");
    }));
    it("#next / #reset", sc.test(function() {
      var instance;
      var $stream1, $stream2;

      $stream1 = arrayToFuncStream([ 1, 2 ]);
      $stream2 = arrayToFuncStream([ 10 ], []);
      instance = this.createInstance("+", $stream1, $stream2);

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(11);
      expect(instance.next(), 2).to.be.a("SCNil");
    }));
    it.skip("#storeOn", function() {
    });
  });

  describe("SCNAryOpStream", function() {
    var SCNAryOpStream;
    before(function() {
      SCNAryOpStream = $("NAryOpStream");
      this.createInstance = function(op, $stream, $argList) {
        return $stream.composeNAryOp($.Symbol(op), $argList);
      };
    });
    it("#next / #reset", function() {
      var instance, test;

      /*
        ~instance = {
          r { [ 1, 2, 3, 4, 5 ].do(_.yield) }.clip(2, 4)
        }.value ;
      */
      instance = this.createInstance(
        "clip", arrayToRoutine([ 1, 2, 3, 4, 5 ]), $$([ 2, 4 ])
      );

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(3);
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(4);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(4);
      expect(instance.next(), 6).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next(), 7).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 8).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 9).to.be.a("SCInteger").that.equals(3);
      expect(instance.next(),10).to.be.a("SCInteger").that.equals(4);
      expect(instance.next(),11).to.be.a("SCInteger").that.equals(4);
      expect(instance.next(),12).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
      var instance, test;

      /*
        ~instance = {
          r { [ 10, 20, 30, 40, 50 ].do(_.yield) }.clip(
		        r { [ 0, 10, 100 ].do(_.yield) },
		        r { [ 5, 50, 500 ].do(_.yield) }
	        )
        }.value;
      */
      instance = this.createInstance(
        "clip", arrayToRoutine([ 10, 20, 30, 40, 50 ]), $$([
          arrayToRoutine([ 0, 10, 100 ]),
          arrayToRoutine([ 5, 50, 500 ])
        ])
      );

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(5);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(20);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(100);
      expect(instance.next(), 4).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(5);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(20);
      expect(instance.next(), 7).to.be.a("SCInteger").that.equals(100);
      expect(instance.next(), 8).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

})();
