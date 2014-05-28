(function() {
  "use strict";

  require("./Stream");

  var $ = sc.lang.$;

  describe("SCStream", function() {
    var SCStream, SCFuncStream, SCOneShotStream;
    before(function() {
      SCStream = $("Stream");
      SCFuncStream    = $("FuncStream");
      SCOneShotStream = $("OneShotStream");
      this.createInstance = function(value, resetFunc) {
        var instance;
        var testMethod = this.test.title.substr(1);
        if (typeof value === "function") {
          instance = SCFuncStream.new($.Function(value), sc.test.encode(resetFunc));
        } else {
          instance = SCOneShotStream.new(sc.test.encode(value));
        }
        sc.test.setSingletonMethod(instance, "Stream", testMethod);
        return instance;
      };
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it("#parent", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.parent();
      expect(test).to.be.a("SCNil");
    });
    it("#next", function() {
      var instance = this.createInstance();
      expect(function() {
        instance.next();
      }).to.throw("should have been implemented by subclass");
    });
    it("#iter", function() {
      var instance = this.createInstance();
      expect(instance.iter).to.be.nop;
    });
    it("#value", function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Integer(count++);
      });

      expect(instance.value()).to.be.a("SCInteger").that.equals(0);
      expect(instance.value()).to.be.a("SCInteger").that.equals(1);
      expect(instance.value()).to.be.a("SCInteger").that.equals(2);
    });
    it("#valueArray", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "next", sc.test.func);

      test = instance.valueArray();
      expect(instance.next).to.be.calledLastIn(test);
    }));
    it("#nextN", function() {
      var instance, test;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Integer(count++);
      });

      test = instance.nextN($.Integer(5));
      expect(test).to.be.a("SCArray").that.eqls([ 0, 1, 2, 3, 4 ]);
    });
    it("#all", function() {
      var instance, test;
      var count = 0;

      instance = this.createInstance(function() {
        return count < 5 ? $.Integer(count++) : $.Nil();
      });

      test = instance.all();
      expect(test).to.be.a("SCArray").that.eqls([ 0, 1, 2, 3, 4 ]);
    });
    it("#put", function() {
      var instance = this.createInstance();
      expect(function() {
        instance.put();
      }).to.throw("should have been implemented by subclass");
    });
    it.skip("#putN", function() {
    });
    it.skip("#putAll", function() {
    });
    it("#do", function() {
      var instance, test;
      var count = 0;
      var $result = $.Array();

      instance = this.createInstance(function() {
        return count < 5 ? $.Integer(count++) : $.Nil();
      });

      test = instance.do($.Function(function($a) {
        $result.add($a);
      }));

      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 0, 1, 2, 3, 4 ]);
    });
    it.skip("#subSample", function() {
    });
    it("#generate", function() {
      var instance, test;
      var count = 0;
      var $result = $.Array();

      instance = this.createInstance(function() {
        return count < 5 ? $.Integer(count++) : $.Nil();
      });

      test = instance.generate($.Function(function($a) {
        $result.add($a);
      }));

      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 0, 1, 2, 3, 4 ]);
    });
    it("#collect", function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return count < 5 ? $.Integer(count++) : $.Nil();
      }, function() {
        count = 0;
        return $.Nil();
      });

      instance = instance.collect($.Function(function($a) {
        return $a.neg();
      }));

      expect(instance.next()).to.be.a("SCInteger").that.equals( 0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-4);
      expect(instance.next()).to.be.a("SCNil");

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals( 0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(-4);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#reject", function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Integer(count++);
      }, function() {
        count = 0;
        return $.Nil();
      });

      instance = instance.reject($.Function(function($a) {
        return $a.odd();
      }));

      expect(instance.next()).to.be.a("SCInteger").that.equals(0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals(0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(4);
    });
    it("#select", function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Integer(count++);
      }, function() {
        count = 0;
        return $.Nil();
      });

      instance = instance.select($.Function(function($a) {
        return $a.odd();
      }));

      expect(instance.next()).to.be.a("SCInteger").that.equals(1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(5);

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals(1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(3);
      expect(instance.next()).to.be.a("SCInteger").that.equals(5);
    });
    it("#dot", function() {
      var instance;
      var values1 = [ 0, 1, 2, 3, 4 ];
      var values2 = [ 10, 20, 30 ];
      var $stream;

      instance = this.createInstance(function() {
        return values1.length ? $.Integer(values1.shift()) : $.Nil();
      }, function() {
        values1 = [ 0, 1, 2, 3, 4 ];
        return $.Nil();
      });
      $stream = $("FuncStream").new($.Function(function() {
        return values2.length ? $.Integer(values2.shift()) : $.Nil();
      }), $.Function(function() {
        values2 = [ 10, 20, 30 ];
        return $.Nil();
      }));

      instance = instance.dot($.Function(function($a, $b) {
        return $a ["+"] ($b);
      }), $stream);

      expect(instance.next()).to.be.a("SCInteger").that.equals(10);
      expect(instance.next()).to.be.a("SCInteger").that.equals(21);
      expect(instance.next()).to.be.a("SCInteger").that.equals(32);
      expect(instance.next()).to.be.a("SCNil");

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals(10);
      expect(instance.next()).to.be.a("SCInteger").that.equals(21);
      expect(instance.next()).to.be.a("SCInteger").that.equals(32);
    });
    it("#interlace", function() {
      var instance;
      var values1 = [ 0, 5 ];
      var values2 = [ 1, 2, 6 ];
      var $stream;

      instance = this.createInstance(function() {
        return values1.length ? $.Integer(values1.shift()) : $.Nil();
      }, function() {
        values1 = [ 0, 5, 7 ];
        return $.Nil();
      });
      $stream = $("FuncStream").new($.Function(function() {
        return values2.length ? $.Integer(values2.shift()) : $.Nil();
      }), $.Function(function() {
        values2 = [ 1, 2 ];
        return $.Nil();
      }));

      instance = instance.interlace($.Function(function($a, $b) {
        return $a ["<"] ($b);
      }), $stream);

      expect(instance.next()).to.be.a("SCInteger").that.equals(0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(5);
      expect(instance.next()).to.be.a("SCInteger").that.equals(6);
      expect(instance.next()).to.be.a("SCNil");

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals(0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2);
      expect(instance.next()).to.be.a("SCInteger").that.equals(5);
      expect(instance.next()).to.be.a("SCInteger").that.equals(7);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#++", sinon.test(function() {
      var instance, test;
      var $stream;

      $stream = sc.test.object();

      instance = this.createInstance();
      this.stub(instance, "appendStream", sc.test.func);

      test = instance ["++"] ($stream);
      expect(instance.appendStream).to.be.calledLastIn(test);
    }));
    it.skip("#appendStream", function() {
    });
    it("#collate", function() {
      var instance;
      var values1, values2;
      var $stream;

      values1 = [ 1, 5 ];
      values2 = [ 0, 6 ];

      instance = this.createInstance(function() {
        return values1.length ? $.Integer(values1.shift()) : $.Nil();
      });
      $stream = $("FuncStream").new($.Function(function() {
        return values2.length ? $.Integer(values2.shift()) : $.Nil();
      }));

      instance = instance.collate($stream);

      expect(instance.next()).to.be.a("SCInteger").that.equals(0);
      expect(instance.next()).to.be.a("SCInteger").that.equals(1);
      expect(instance.next()).to.be.a("SCInteger").that.equals(5);
      expect(instance.next()).to.be.a("SCInteger").that.equals(6);
      expect(instance.next()).to.be.a("SCNil");
    });
    it("#<>", sinon.test(function() {
      var instance, test;
      var $obj, $new, $asStream;

      $obj = sc.test.object();
      $new = this.spy(function() {
        return sc.test.object({ asStream: $asStream });
      });
      $asStream = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("Pchain").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance ["<>"] ($obj);
      expect($new.firstCall).to.be.calledWith(instance, $obj);
      expect($asStream).to.be.calledLastIn(test);
    }));
    it("#composeUnaryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $new;

      $argSelector = sc.test.object();
      $new = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("UnaryOpStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeUnaryOp($argSelector);
      expect($new.firstCall).to.be.calledWith($argSelector, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $argStream, $new;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $new = this.spy(sc.test.func);

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeBinaryOp($argSelector, $argStream);
      expect($new.firstCall).to.be.calledWith($argSelector, instance, $argStream);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp with adverb 'x'", sinon.test(function() {
      var instance, test;
      var $argSelector, $argStream, $adverb, $new;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $adverb      = $.Symbol("x");
      $new = this.spy(sc.test.func);

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpXStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeBinaryOp($argSelector, $argStream, $adverb);
      expect($new.firstCall).to.be.calledWith($argSelector, instance, $argStream);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp with unknown adverb", function() {
      var instance, test;
      var $argSelector, $argStream, $adverb;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $adverb      = $.Symbol("unknown");

      instance = this.createInstance();

      test = instance.composeBinaryOp($argSelector, $argStream, $adverb);
      expect(test).to.be.a("SCNil");
    });
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $argStream, $new;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $new = this.spy(sc.test.func);

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($argSelector, $argStream);
      expect($new.firstCall).to.be.calledWith($argSelector, $argStream, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp with adverb 'x'", sinon.test(function() {
      var instance, test;
      var $argSelector, $argStream, $adverb, $new;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $adverb      = $.Symbol("x");
      $new = this.spy(sc.test.func);

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpXStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($argSelector, $argStream, $adverb);
      expect($new.firstCall).to.be.calledWith($argSelector, $argStream, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp with unknown adverb", function() {
      var instance, test;
      var $argSelector, $argStream, $adverb;

      $argSelector = sc.test.object();
      $argStream   = SCStream.new();
      $adverb      = $.Symbol("unknown");

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($argSelector, $argStream, $adverb);
      expect(test).to.be.a("SCNil");
    });
    it("#composeNAryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $anArgList, $new;

      $argSelector = sc.test.object();
      $anArgList   = $.Array([ $.Integer(1), $.Integer(2) ]);

      $new = this.spy(sc.test.func);
      this.stub(sc.lang.klass, "get").withArgs("NAryOpStream").returns(sc.test.object({
        new: $new
      }));

      instance = this.createInstance();
      test = instance.composeNAryOp($argSelector, $anArgList);
      expect($new.args[0][0]).to.equal($argSelector);
      expect($new.args[0][1]).to.equal(instance);
      expect($new.args[0][2]).to.be.a("SCArray").that.eqls([ 1, 2 ]);
    }));
    it.skip("#embedInStream", function() {
    });
    it.skip("#asEventStreamPlayer", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#trace", function() {
    });
    it.skip("#repeat", function() {
    });
  });

  describe("SCOneShotStream", function() {
    var SCOneShotStream;
    before(function() {
      SCOneShotStream = $("OneShotStream");
      this.createInstance = function(value) {
        return SCOneShotStream.new(sc.test.encode(value));
      };
    });
    it("#next / #reset", function() {
      var instance;

      instance = this.createInstance(100);
      expect(instance.next()).to.be.a("SCInteger").that.equals(100);
      expect(instance.next()).to.be.a("SCNil");
      expect(instance.next()).to.be.a("SCNil");

      instance.reset();
      expect(instance.next()).to.be.a("SCInteger").that.equals(100);
      expect(instance.next()).to.be.a("SCNil");
      expect(instance.next()).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

  describe("SCFuncStream", function() {
    var SCFuncStream;
    before(function() {
      SCFuncStream = $("FuncStream");
      this.createInstance = function(nextFunc, resetFunc) {
        return SCFuncStream.new(sc.test.encode(nextFunc), sc.test.encode(resetFunc));
      };
      $("Environment").new().push();
    });
    after(function() {
      $("Environment").pop();
    });
    it("<>envir", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.envir_($.Integer(10));
      expect(test).to.equal(instance);

      test = instance.envir();
      expect(test).to.be.a("SCInteger").that.equals(10);
    });
    it("#next / #reset", function() {
      var instance, test;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Environment("a")  ["+"] ($.Integer(count++));
      }, function() {
        var saved = count;
        count = 0;
        return $.Integer(saved);
      });
      instance.envir_(
        $("Environment").newFrom(sc.test.encode([ "\\a", 1000 ]))
      );
      expect(instance.next()).to.be.a("SCInteger").that.equals(1000);
      expect(instance.next()).to.be.a("SCInteger").that.equals(1001);
      expect(instance.next()).to.be.a("SCInteger").that.equals(1002);

      test = instance.reset();
      expect(test).to.be.a("SCInteger").that.equals(3);

      instance.envir_(
        $("Environment").newFrom(sc.test.encode([ "\\a", 2000 ]))
      );
      expect(instance.next()).to.be.a("SCInteger").that.equals(2000);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2001);
      expect(instance.next()).to.be.a("SCInteger").that.equals(2002);
    });
  });

  describe("SCPauseStream", function() {
    var SCPauseStream;
    before(function() {
      SCPauseStream = $("PauseStream");
      this.createInstance = function() {
        return SCPauseStream.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("<stream", function() {
    });
    it.skip("<originalStream", function() {
    });
    it.skip("<clock", function() {
    });
    it.skip("<nextBeat", function() {
    });
    it.skip("<>streamHasEnded", function() {
    });
    it.skip("#isPlaying", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#stop", function() {
    });
    it.skip("#prStop", function() {
    });
    it.skip("#removedFromScheduler", function() {
    });
    it.skip("#streamError", function() {
    });
    it.skip("#wasStopped", function() {
    });
    it.skip("#canPause", function() {
    });
    it.skip("#pause", function() {
    });
    it.skip("#resume", function() {
    });
    it.skip("#refresh", function() {
    });
    it.skip("#start", function() {
    });
    it.skip("#stream_", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#awake", function() {
    });
    it.skip("#threadPlayer", function() {
    });
  });

  describe("SCTask", function() {
    var SCTask;
    before(function() {
      SCTask = $("Task");
      this.createInstance = function() {
        return SCTask.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.equal(instance);
    });
    it.skip("#storeArgs", function() {
    });
  });
})();
