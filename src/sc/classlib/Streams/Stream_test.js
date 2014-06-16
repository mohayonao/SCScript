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
    var SCStream, SCOneShotStream;
    before(function() {
      SCStream        = $("Stream");
      SCOneShotStream = $("OneShotStream");
      SCRoutine       = $("Routine");
      this.createInstance = function(value) {
        var instance;
        value = $$(value || null);
        if (value.isKindOf(SCStream).__bool__()) {
          instance = value;
        } else {
          instance = SCOneShotStream.new(value);
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
      /*
        r = r { [ 1, 2, 3, 4, 5 ].do(_.yield) }
      */
      var r = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      expect(r.value(), 1).to.be.a("SCInteger").that.equals(1);
      expect(r.value(), 2).to.be.a("SCInteger").that.equals(2);
      expect(r.value(), 3).to.be.a("SCInteger").that.equals(3);
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
    it("#putN", sinon.test(function() {
      var instance, test;
      var $item;

      $item = $$();

      instance = this.createInstance();
      this.stub(instance, "put");

      test = instance.putN($$(3), $item);
      expect(test).to.equal(instance);
      expect(instance.put).to.callCount(3);
      expect(instance.put.args[0]).to.eql([ $item ]);
      expect(instance.put.args[1]).to.eql([ $item ]);
      expect(instance.put.args[2]).to.eql([ $item ]);
    }));
    it("#putAll", sinon.test(function() {
      var instance, test;
      var $collection;

      $collection = $$([ 1, 2, 3 ]);

      instance = this.createInstance();
      this.stub(instance, "put");

      test = instance.putAll($collection);
      expect(test).to.equal(instance);
      expect(instance.put).to.callCount(3);
      expect(instance.put.args[0]).to.eql($$([ 1 ])._);
      expect(instance.put.args[1]).to.eql($$([ 2 ])._);
      expect(instance.put.args[2]).to.eql($$([ 3 ])._);
    }));
    it("#do", function() {
      var instance, test;
      var $result = $$([]);

      instance = this.createInstance(arrayToRoutine([ 1, 2, 3, 4, 5 ]));

      test = instance.generate($$(function($a) {
        $result.add($a);
      }));
      expect(test).to.equal(instance);
      expect($result).to.be.a("SCArray").that.eqls([ 1, 2, 3, 4, 5 ]);
    });
    it.skip("#subSample", function() {
      /*
        r = r { [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ].do(_.yield) }.subSample(1, 3);
      */
      var r = this.createInstance(arrayToRoutine(
        [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10 ]
      )).subSample($$(1), $$(3));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals( 2);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals( 6);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(10);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.equal(r);
      expect(r.next() , 6).to.be.a("SCNil");
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
      /*
        r = r { [ 1, 2, 3, 4, 5 ].do(_.yield) }.collect(_.neg)
      */
      var r = this.createInstance(
        arrayToRoutine([ 1, 2, 3, 4, 5 ])
      ).collect($$(function($a) {
        return $a.neg();
      }));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(-1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(-2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(-3);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(-4);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(-5);
      expect(r.next() , 6).to.be.a("SCNil");
      expect(r.reset(), 7).to.be.a("SCRoutine");
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(-1);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(-2);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(-3);
    }));
    it("#reject", sc.test(function() {
      /*
        r = r { [ 1, 2, 3, 4, 5 ].do(_.yield) }.reject(_.neg)
      */
      var r = this.createInstance(
        arrayToRoutine([ 1, 2, 3, 4, 5 ])
      ).reject($$(function($a) {
        return $a.odd();
      }));
      expect(r.next() , 1).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 3).to.be.a("SCNil");
      expect(r.reset(), 4).to.be.a("SCRoutine");
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 7).to.be.a("SCNil");
    }));
    it("#select", sc.test(function() {
      /*
        r = r { [ 1, 2, 3, 4, 5 ].do(_.yield) }.select(_.neg)
      */
      var r = this.createInstance(
        arrayToRoutine([ 1, 2, 3, 4, 5 ])
      ).select($$(function($a) {
        return $a.odd();
      }));
      expect(r.next() , 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.be.a("SCRoutine");
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 9).to.be.a("SCNil");
    }));
    it("#dot", sc.test(function() {
      /*
        r = r { [ 0, 1, 2, 3, 4 ].do(_.yield) }.dot({ |a, b|
          a + b
        }, r { [ 10, 20, 30 ].do(_.yield) })
      */
      var r = this.createInstance(
        arrayToRoutine([ 0, 1, 2, 3, 4 ])
      ).dot($$(function($a, $b) {
        return $a ["+"] ($b);
      }), arrayToRoutine([ 10, 20, 30 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(10);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(21);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(32);
      expect(r.next() , 4).to.be.a("SCNil");
      expect(r.reset(), 5).to.be.a("SCRoutine");
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(10);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(21);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(32);
    }));
    it("#interlace case1", sc.test(function() {
      /*
        r = r { [ 0, 5, 7 ].do(_.yield) }.interlace({ |a, b|
          a < b
        }, r { [ 1, 2 ].do(_.yield) })
      */
      var r = this.createInstance(
        arrayToRoutine([ 0, 5 ])
      ).interlace($$(function($a, $b) {
        return $a ["<"] ($b);
      }), arrayToRoutine([ 1, 2, 6 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(6);
      expect(r.next() , 6).to.be.a("SCNil");
      expect(r.reset(), 7).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,11).to.be.a("SCInteger").that.equals(5);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(6);
      expect(r.next() ,13).to.be.a("SCNil");
    }));
    it("#interlace case2", sc.test(function() {
      /*
        r = r { [ 0, 5, 7 ].do(_.yield) }.interlace({ |a, b|
          a < b
        }, r { [ 1, 2 ].do(_.yield) })
      */
      var r = this.createInstance(
        arrayToRoutine([ 0, 5, 7 ])
      ).interlace($$(function($a, $b) {
        return $a ["<"] ($b);
      }), arrayToRoutine([ 1, 2 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(7);
      expect(r.next() , 6).to.be.a("SCNil");
      expect(r.reset(), 7).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,11).to.be.a("SCInteger").that.equals(5);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(7);
      expect(r.next() ,13).to.be.a("SCNil");
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
    it("#appendStream", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) }.appendStream(r { [ 4, 5, 6 ].do(_.yield) })
      */
      var r = this.createInstance(arrayToRoutine([
        1, 2, 3
      ])).appendStream(arrayToRoutine([ 4, 5, 6 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(6);
      expect(r.next() , 7).to.be.a("SCNil");
      expect(r.reset(), 8).to.equal(r);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,11).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(4);
      expect(r.next() ,13).to.be.a("SCInteger").that.equals(5);
      expect(r.next() ,14).to.be.a("SCInteger").that.equals(6);
      expect(r.next() ,15).to.be.a("SCNil");
    });
    it("#collate", sc.test(function() {
      var r = this.createInstance(
        arrayToRoutine([ 1, 5 ])
      ).collate(arrayToRoutine([ 0, 6 ]));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(6);
      expect(r.next() , 5).to.be.a("SCNil");
      expect(r.reset(), 6).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(0);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(5);
      expect(r.next() ,10).to.be.a("SCInteger").that.equals(6);
      expect(r.next() ,11).to.be.a("SCNil");
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
    it("#embedInStream", function() {
      var instance = this.createInstance(arrayToRoutine([ 2, 3, 4 ]));
      var r = SCRoutine.new($.Function(function() {
        return [
          function() {
            return $$(1).yield();
          },
          function() {
            return instance.embedInStream();
          },
          function() {
            return $$(5).yield();
          }
        ];
      }));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(4);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(5);
      expect(r.next() , 6).to.be.a("SCNil");
      expect(r.reset(), 7).to.equal(r);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(5);
      expect(r.next() ,10).to.be.a("SCNil");
    });
    it("#asEventStreamPlayer", sinon.test(function() {
      var instance, test;
      var $protoEvent, $new;

      $protoEvent = $$();

      $new = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("EventStreamPlayer").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.asEventStreamPlayer($protoEvent);
      expect($new.args[0]).to.eql([ instance, $protoEvent ]);
    }));
    it("#play case1", sinon.test(function() {
      var instance, test;
      var $clock, $quant, $asQuant;

      $clock = $$({ play: this.spy() });
      $quant = $$({ asQuant: this.spy(function() {
        return $asQuant;
      }) });
      $asQuant = $$();

      instance = this.createInstance();

      test = instance.play($clock, $quant);
      expect(test).to.equal(instance);
      expect($clock.play).to.be.calledWith(instance, $asQuant);
    }));
    it("#play case2", sinon.test(function() {
      var instance, test;
      var $clock, $quant, $asQuant, $tempoClock;

      $clock = $$(null);
      $quant = $$({ asQuant: this.spy(function() {
        return $asQuant;
      }) });
      $asQuant = $$();
      $tempoClock = $$({ play: this.spy() });
      this.stub(sc.lang.klass, "get").withArgs("TempoClock").returns($$({
        default: function() {
          return $tempoClock;
        }
      }));

      instance = this.createInstance();

      test = instance.play($clock, $quant);
      expect(test).to.equal(instance);
      expect($tempoClock.play).to.be.calledWith(instance, $asQuant);
    }));
    it.skip("#trace", function() {
    });
    it("#repeat", function() {
      /*
        r = r { [ 1, 2, 3 ].do(_.yield) }.repeat(3)
      */
      var r = this.createInstance(arrayToRoutine([ 1, 2, 3 ])).repeat($$(3));

      expect(r.next() , 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 3).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 4).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 5).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 6).to.be.a("SCInteger").that.equals(3);
      expect(r.next() , 7).to.be.a("SCInteger").that.equals(1);
      expect(r.next() , 8).to.be.a("SCInteger").that.equals(2);
      expect(r.next() , 9).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,10).to.be.a("SCNil");
      expect(r.reset(),11).to.equal(r);
      expect(r.next() ,12).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,13).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,14).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,15).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,16).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,17).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,18).to.be.a("SCInteger").that.equals(1);
      expect(r.next() ,19).to.be.a("SCInteger").that.equals(2);
      expect(r.next() ,20).to.be.a("SCInteger").that.equals(3);
      expect(r.next() ,21).to.be.a("SCNil");
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
