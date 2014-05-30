(function() {
  "use strict";

  require("./BasicOpsStream");

  var $ = sc.lang.$;

  function arrayToFuncStream() {
    var args = arguments, i = 0, j = 0;
    return $("FuncStream").new($.Function(function() {
      return sc.test.encode(args[i][j++]);
    }), $.Function(function() {
      i = (i + 1) % args.length;
      j = 0;
      return $.Nil();
    }));
  }

  describe("SCUnaryOpStream", function() {
    var SCUnaryOpStream;
    before(function() {
      SCUnaryOpStream = $("UnaryOpStream");
      this.createInstance = function(op, $stream) {
        return $stream.composeUnaryOp($.Symbol(op));
      };
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("#next / #reset", function() {
      var instance, test;
      var $stream;

      /*
        ~instance = {
          var list = [ 1, 2, 3 ], i = 0;
          var stream = FuncStream.new({ i = i + 1; list[i-1]; }, { i = 0 });
          stream.neg
        }.value;
      */
      $stream  = arrayToFuncStream([ 1, 2, 3 ]);
      instance = this.createInstance("neg", $stream);

      expect(instance.next()).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next()).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next()).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next()).to.be.a("SCNil");
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
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("#next/ #reset", function() {
      var instance, test;
      var $stream1, $stream2;

      /*
        ~instance = {
          var list1 = [ 1, 2, 3 ], i1 = 0;
          var list2 = [ 10, 20  ], i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1 + stream2
        }.value;
      */
      $stream1 = arrayToFuncStream([ 1, 2, 3 ]);
      $stream2 = arrayToFuncStream([ 10, 20 ]);
      instance = this.createInstance("+", $stream1, $stream2);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCInteger").that.equals(22);
      expect(instance.next()).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCInteger").that.equals(22);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#next/ #reset", function() {
      var instance;
      var $stream1, $stream2;

      /*
        ~instance = {
          var list1 = [ 1, 2, 3 ], i1 = 0;
          var list2 = [ 10, 20, 30, 40  ], i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1 + stream2
        }.value;
      */
      $stream1 = arrayToFuncStream([ 1, 2, 3 ]);
      $stream2 = arrayToFuncStream([ 10, 20, 30, 40 ]);
      instance = this.createInstance("+", $stream1, $stream2);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCInteger").that.equals(22);
      expect(instance.next()).to.be.a("SCInteger").that.equals(33);
      expect(instance.next()).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpXStream", function() {
    var SCBinaryOpXStream;
    before(function() {
      SCBinaryOpXStream = $("BinaryOpXStream");
      this.createInstance = function(op, $stream, $argStream) {
        return $stream.composeBinaryOp($.Symbol(op), $argStream, $.Symbol("x"));
      };
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("#next / #reset", function() {
      var instance, test;
      var $stream1, $stream2;

      /*
        ~instance = {
          var list1 = [ 1, 2, 3 ], i1 = 0;
          var list2 = [ 10, 20  ], i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1 +.x stream2
        }.value;
      */
      $stream1 = arrayToFuncStream([ 1, 2, 3 ]);
      $stream2 = arrayToFuncStream([ 10, 20 ]);
      instance = this.createInstance("+", $stream1, $stream2);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCInteger").that.equals(21);
      expect(instance.next()).to.be.a("SCInteger").that.equals(12);
      expect(instance.next()).to.be.a("SCInteger").that.equals(22);
      expect(instance.next()).to.be.a("SCInteger").that.equals(13);
      expect(instance.next()).to.be.a("SCInteger").that.equals(23);
      expect(instance.next()).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCInteger").that.equals(21);
      expect(instance.next()).to.be.a("SCInteger").that.equals(12);
      expect(instance.next()).to.be.a("SCInteger").that.equals(22);
      expect(instance.next()).to.be.a("SCInteger").that.equals(13);
      expect(instance.next()).to.be.a("SCInteger").that.equals(23);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
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

      expect(instance.next()).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
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

      expect(instance.next()).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
      var instance;
      var $stream1, $stream2;

      $stream1 = arrayToFuncStream([ 1, 2 ]);
      $stream2 = arrayToFuncStream([ 10 ], []);
      instance = this.createInstance("+", $stream1, $stream2);

      expect(instance.next()).to.be.a("SCInteger").that.equals(11);
      expect(instance.next()).to.be.a("SCNil");
    });
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
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("#next / #reset", function() {
      var instance, test;
      var $stream, $argList;

      /*
        ~instance = {
          var list = [ 1, 2, 3, 4, 5 ], i = 0;
          var stream = FuncStream.new({ i = i + 1; list[i-1]; }, { i = 0 });
          stream.clip(2, 4)
        }.value ;
      */
      $stream  = arrayToFuncStream([ 1, 2, 3, 4, 5 ]);
      $argList = sc.test.encode([ 2, 4 ]);
      instance = this.createInstance("clip", $stream, $argList);

      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);
      expect(instance.next()).to.be.a("SCNil");

      test = instance.reset();
      expect(test).to.equal(instance);

      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#next / #reset", function() {
      var instance;
      var $stream, $argList;

      /*
        ~instance = {
          var list1 = [ 1, 2, 3, 4, 5 ], i1 = 0;
          var list2 = [ 3, 2, 3 ], i2 = 0;
          var stream1 = FuncStream.new({ i1 = i1 + 1; list1[i1-1]; }, { i1 = 0 });
          var stream2 = FuncStream.new({ i2 = i2 + 1; list2[i2-1]; }, { i2 = 0 });
          stream1.clip(stream2, 4)
        }.value;
      */
      $stream  = arrayToFuncStream([ 1, 2, 3, 4, 5 ]);
      $argList = sc.test.encode([ arrayToFuncStream([ 3, 2, 3 ]), 4 ]);
      instance = this.createInstance("clip", $stream, $argList);

      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCNil");
    });
    it.skip("#storeOn", function() {
    });
  });

})();
