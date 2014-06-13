(function() {
  "use strict";

  require("./Stream");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var SCRoutine;

  function arrayToRoutine(array) {
    return SCRoutine.new($$(function() {
      return $$(array).do($$(function($_) {
        return $_.yield();
      }));
    }));
  }

  describe("SCStream", function() {
    var SCStream, SCFuncStream, SCOneShotStream;
    before(function() {
      SCStream        = $("Stream");
      SCFuncStream    = $("FuncStream");
      SCOneShotStream = $("OneShotStream");
      SCRoutine       = $("Routine");
      this.createInstance = function(value, resetFunc) {
        var instance;
        if (typeof value === "function") {
          instance = SCFuncStream.new($$(value), $$(resetFunc));
        } else {
          value = $$(value || null);
          if (value.isKindOf(SCStream).__bool__()) {
            instance = value;
          } else {
            instance = SCOneShotStream.new(value);
          }
        }
        return $$(instance, "Stream" + this.test.title);
      };
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

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      expect(instance.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(instance.value(), 2).to.be.a("SCInteger").that.equals(2);
      expect(instance.value(), 3).to.be.a("SCInteger").that.equals(3);
    });
    it("#valueArray", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "next", sc.test.func());

      test = instance.valueArray();
      expect(instance.next).to.be.calledLastIn(test);
    }));
    it("#nextN", function() {
      var instance, test;

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      test = instance.nextN($$(3));
      expect(test).to.be.a("SCArray").that.eqls([ 1, 2, 3 ]);
    });
    it("#all", function() {
      var instance, test;

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      test = instance.all();
      expect(test).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4, 5 ]);
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
    it("#do 1", function() {
      var instance, test;
      var $result = $$([]);

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      test = instance.generate($$(function($a) {
        $result.add($a);
      }));
      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4, 5 ]);
    });
    it("#do 2", sc.test(function() {
      var instance, test, count = 1;
      var $result = $$([]);

      instance = this.createInstance(function() {
        return count < 6 ? $$(count++) : $$(null);
      });

      test = instance.do($$(function($a) {
        $result.add($a);
      }));

      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4, 5 ]);
    }));
    it.skip("#subSample", function() {
    });
    it("#generate", function() {
      var instance, test;
      var $result = $$([]);

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      test = instance.generate($$(function($a) {
        $result.add($a);
      }));
      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4, 5 ]);
    });
    it("#collect", sc.test(function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return count < 5 ? $$(count++) : $$(null);
      }, function() {
        count = 0;
        return $$(null);
      });

      instance = instance.collect($$(function($a) {
        return $a.neg();
      }));

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals( 0);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(-4);
      expect(instance.next(), 6).to.be.a("SCNil");

      instance.reset();
      expect(instance.next(), 7).to.be.a("SCInteger").that.equals( 0);
      expect(instance.next(), 8).to.be.a("SCInteger").that.equals(-1);
      expect(instance.next(), 9).to.be.a("SCInteger").that.equals(-2);
      expect(instance.next(),10).to.be.a("SCInteger").that.equals(-3);
      expect(instance.next(),11).to.be.a("SCInteger").that.equals(-4);
      expect(instance.next(),12).to.be.a("SCNil");
    }));
    it("#reject", sc.test(function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return $$(count++);
      }, function() {
        count = 0;
        return $$(null);
      });

      instance = instance.reject($$(function($a) {
        return $a.odd();
      }));

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(0);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(4);

      instance.reset();
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(0);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(4);
    }));
    it("#select", sc.test(function() {
      var instance;
      var count = 0;

      instance = this.createInstance(function() {
        return $$(count++);
      }, function() {
        count = 0;
        return $$(null);
      });

      instance = instance.select($$(function($a) {
        return $a.odd();
      }));

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(1);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(3);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(5);

      instance.reset();
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(1);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(3);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(5);
    }));
    it("#dot", sc.test(function() {
      var instance;
      var values1 = [ 0, 1, 2, 3, 4 ];
      var values2 = [ 10, 20, 30 ];
      var $stream;

      instance = this.createInstance(function() {
        return values1.length ? $$(values1.shift()) : $$(null);
      }, function() {
        values1 = [ 0, 1, 2, 3, 4 ];
        return $$(null);
      });
      $stream = $("FuncStream").new($$(function() {
        return values2.length ? $$(values2.shift()) : $$(null);
      }), $$(function() {
        values2 = [ 10, 20, 30 ];
        return $$(null);
      }));

      instance = instance.dot($$(function($a, $b) {
        return $a ["+"] ($b);
      }), $stream);

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(10);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(21);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(32);
      expect(instance.next(), 4).to.be.a("SCNil");

      instance.reset();
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(10);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(21);
      expect(instance.next(), 7).to.be.a("SCInteger").that.equals(32);
    }));
    it("#interlace", sc.test(function() {
      var instance;
      var values1 = [ 0, 5 ];
      var values2 = [ 1, 2, 6 ];
      var $stream;

      instance = this.createInstance(function() {
        return values1.length ? $$(values1.shift()) : $$(null);
      }, function() {
        values1 = [ 0, 5, 7 ];
        return $$(null);
      });
      $stream = $("FuncStream").new($$(function() {
        return values2.length ? $$(values2.shift()) : $$(null);
      }), $$(function() {
        values2 = [ 1, 2 ];
        return $$(null);
      }));

      instance = instance.interlace($$(function($a, $b) {
        return $a ["<"] ($b);
      }), $stream);

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(0);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(1);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(5);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(6);
      expect(instance.next(), 6).to.be.a("SCNil");

      instance.reset();
      expect(instance.next(), 7).to.be.a("SCInteger").that.equals(0);
      expect(instance.next(), 8).to.be.a("SCInteger").that.equals(1);
      expect(instance.next(), 9).to.be.a("SCInteger").that.equals(2);
      expect(instance.next(),10).to.be.a("SCInteger").that.equals(5);
      expect(instance.next(),11).to.be.a("SCInteger").that.equals(7);
      expect(instance.next(),12).to.be.a("SCNil");
    }));
    it("#++", sinon.test(function() {
      var instance, test;
      var $stream;

      $stream = $$();

      instance = this.createInstance();
      this.stub(instance, "appendStream", sc.test.func());

      test = instance ["++"] ($stream);
      expect(instance.appendStream).to.be.calledLastIn(test);
    }));
    it.skip("#appendStream", function() {
    });
    it("#collate", sc.test(function() {
      var instance;
      var values1, values2;
      var $stream;

      values1 = [ 1, 5 ];
      values2 = [ 0, 6 ];

      instance = this.createInstance(function() {
        return values1.length ? $$(values1.shift()) : $$(null);
      });
      $stream = $("FuncStream").new($$(function() {
        return values2.length ? $$(values2.shift()) : $$(null);
      }));

      instance = instance.collate($stream);

      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(0);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(1);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(5);
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(6);
      expect(instance.next(), 5).to.be.a("SCNil");
    }));
    it("#<>", sinon.test(function() {
      var instance, test;
      var $obj, $new, $asStream;

      $obj = $$();
      $new = this.spy(function() {
        return $$({ asStream: $asStream });
      });
      $asStream = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("Pchain").returns($$({
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

      $argSelector = $$();
      $new = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("UnaryOpStream").returns($$({
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

      $argSelector = $$();
      $argStream   = SCStream.new();
      $new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpStream").returns($$({
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

      $argSelector = $$();
      $argStream   = $$(SCStream.new());
      $adverb      = $$("\\x");
      $new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpXStream").returns($$({
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

      $argSelector = $$();
      $argStream   = $$(SCStream.new());
      $adverb      = $$("\\unknown");

      instance = this.createInstance();

      test = instance.composeBinaryOp($argSelector, $argStream, $adverb);
      expect(test).to.be.a("SCNil");
    });
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $argStream, $new;

      $argSelector = $$();
      $argStream   = $$(SCStream.new());
      $new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpStream").returns($$({
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

      $argSelector = $$();
      $argStream   = $$(SCStream.new());
      $adverb      = $$("\\x");
      $new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("BinaryOpXStream").returns($$({
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

      $argSelector = $$();
      $argStream   = $$(SCStream.new());
      $adverb      = $$("\\unknown");

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($argSelector, $argStream, $adverb);
      expect(test).to.be.a("SCNil");
    });
    it("#composeNAryOp", sinon.test(function() {
      var instance, test;
      var $argSelector, $anArgList, $new;

      $argSelector = $$();
      $anArgList   = $$([ 1, 2 ]);

      $new = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("NAryOpStream").returns($$({
        new: $new
      }));

      instance = this.createInstance();
      test = instance.composeNAryOp($argSelector, $anArgList);
      expect($new.args[0]).to.eql($$([ $argSelector, instance, [ 1, 2 ] ])._);
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
        return SCOneShotStream.new($$(value));
      };
    });
    it("#next / #reset", function() {
      var instance;

      instance = this.createInstance(100);
      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(100);
      expect(instance.next(), 2).to.be.a("SCNil");
      expect(instance.next(), 3).to.be.a("SCNil");

      instance.reset();
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(100);
      expect(instance.next(), 5).to.be.a("SCNil");
      expect(instance.next(), 6).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

  describe("SCFuncStream", function() {
    var SCFuncStream;
    before(function() {
      SCFuncStream = $("FuncStream");
      this.createInstance = function(nextFunc, resetFunc) {
        return SCFuncStream.new($$(nextFunc), $$(resetFunc));
      };
    });
    it("<>envir", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.envir_($$(10));
      expect(test).to.equal(instance);

      test = instance.envir();
      expect(test).to.be.a("SCInteger").that.equals(10);
    });
    it("#next / #reset", function() {
      var instance, test;
      var count = 0;

      instance = this.createInstance(function() {
        return $.Environment("a")  ["+"] ($$(count++));
      }, function() {
        var saved = count;
        count = 0;
        return $$(saved);
      });
      instance.envir_(
        $("Environment").newFrom($$([ "\\a", 1000 ]))
      );
      expect(instance.next(), 1).to.be.a("SCInteger").that.equals(1000);
      expect(instance.next(), 2).to.be.a("SCInteger").that.equals(1001);
      expect(instance.next(), 3).to.be.a("SCInteger").that.equals(1002);

      test = instance.reset();
      expect(test).to.be.a("SCInteger").that.equals(3);

      instance.envir_(
        $("Environment").newFrom($$([ "\\a", 2000 ]))
      );
      expect(instance.next(), 4).to.be.a("SCInteger").that.equals(2000);
      expect(instance.next(), 5).to.be.a("SCInteger").that.equals(2001);
      expect(instance.next(), 6).to.be.a("SCInteger").that.equals(2002);
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
