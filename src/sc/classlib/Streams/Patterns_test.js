(function() {
  "use strict";

  require("./Patterns");
  require("./ListPatterns");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var klass = sc.lang.klass;

  describe("SCPattern", function() {
    var SCPattern, SCPseq;
    before(function() {
      SCPattern = $("Pattern");
      SCPseq    = $("Pseq");
      this.createInstance = function(list) {
        var instance;
        if (Array.isArray(list)) {
          instance = SCPseq.new($$(list));
        } else {
          instance = SCPattern.new();
        }
        return $$(instance, "Pattern" + this.test.title);
      };
    });
    it("#++", sinon.test(function() {
      var instance, test;
      var $aPattern, $new;

      $aPattern = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pseq").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance ["++"] ($aPattern);
      expect($new.args[0]).to.eqls($$([ [ instance, $aPattern ] ])._);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#<>", sinon.test(function() {
      var instance, test;
      var $aPattern, $new;

      $aPattern = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pchain").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance ["<>"] ($aPattern);
      expect($new).to.be.calledWith(instance, $aPattern);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#play", sinon.test(function() {
      var instance, test;
      var $clock, $protoEvent, $quant, $play;

      $clock = $$();
      $protoEvent = $$();
      $quant = $$();
      $play = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(instance, "asEventStreamPlayer", this.spy(function() {
        return $$({ play: $play });
      }));

      test = instance.play($clock, $protoEvent, $quant);
      expect(instance.asEventStreamPlayer).to.be.calledWith($protoEvent);
      expect($play).to.be.calledWith($clock, $.False(), $quant);
      expect($play).to.be.calledLastIn(test);
    }));
    it("#asStream", function() {
      var r = this.createInstance([ 1, 2, 3 ]).asStream();
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(3);
      expect(r.next(), 4).to.be.a("SCNil");
    });
    it("#iter", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "asStream", sc.test.func());

      test = instance.iter();
      expect(instance.asStream).to.be.calledLastIn(test);
    }));
    it("#streamArg", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "asStream", sc.test.func());

      test = instance.streamArg();
      expect(instance.asStream).to.be.calledLastIn(test);
    }));
    it("#asEventStreamPlayer", sinon.test(function() {
      var instance, test;
      var $protoEvent, $stream, $new;

      $protoEvent = $$();
      $stream = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("EventStreamPlayer").returns({
        new: $new
      });

      instance = this.createInstance();
      this.stub(instance, "asStream").returns($stream);

      test = instance.asEventStreamPlayer($protoEvent);
      expect($new).to.be.calledWith($stream, $protoEvent);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#embedInStream", sinon.test(function() {
      var instance, test;
      var $inval, $stream;

      $inval = $$();
      $stream = $$({ embedInStream: this.spy() });

      instance = this.createInstance();
      this.stub(instance, "asStream").returns($stream);

      test = instance.embedInStream($inval);
      expect($stream.embedInStream).to.be.calledWith($inval);
      expect($stream.embedInStream).to.be.calledLastIn(test);
    }));
    it("#do", sinon.test(function() {
      var instance, test;
      var $function, $stream;

      $function = $$();
      $stream = $$({ do: this.spy() });

      instance = this.createInstance();
      this.stub(instance, "asStream").returns($stream);

      test = instance.do($function);
      expect($stream.do).to.be.calledWith($function);
      expect($stream.do).to.be.calledLastIn(test);
    }));
    it("#collect", sinon.test(function() {
      var instance, test;
      var $function, $new;

      $function = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pcollect").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.collect($function);
      expect($new).to.be.calledWith($function, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#select", sinon.test(function() {
      var instance, test;
      var $function, $new;

      $function = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pselect").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.select($function);
      expect($new).to.be.calledWith($function, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#reject", sinon.test(function() {
      var instance, test;
      var $function, $new;

      $function = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Preject").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.reject($function);
      expect($new).to.be.calledWith($function, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeUnaryOp", sinon.test(function() {
      var instance, test;
      var $operator, $new;

      $operator = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Punop").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeUnaryOp($operator);
      expect($new).to.be.calledWith($operator, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp", sinon.test(function() {
      var instance, test;
      var $operator, $pattern, $adverb, $new;

      $operator = $$();
      $pattern  = $$();
      $adverb   = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pbinop").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeBinaryOp($operator, $pattern, $adverb);
      expect($new).to.be.calledWith($operator, instance, $pattern, $adverb);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test;
      var $operator, $pattern, $adverb, $new;

      $operator = $$();
      $pattern  = $$();
      $adverb   = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pbinop").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($operator, $pattern, $adverb);
      expect($new).to.be.calledWith($operator, $pattern, instance, $adverb);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#composeNAryOp", sinon.test(function() {
      var instance, test;
      var $selector, $argList, $new;

      $selector = $$();
      $argList  = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pnaryop").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.composeNAryOp($selector, $argList);
      expect($new).to.be.calledWith($selector, instance, $argList);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#mtranspose", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.mtranspose($n);
      expect($new).to.be.calledWith($$("\\mtranspose"), $n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#ctranspose", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.ctranspose($n);
      expect($new).to.be.calledWith($$("\\ctranspose"), $n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#gtranspose", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.gtranspose($n);
      expect($new).to.be.calledWith($$("\\gtranspose"), $n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#detune", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.detune($n);
      expect($new).to.be.calledWith($$("\\detune"), $n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#scaleDur", sinon.test(function() {
      var instance, test;
      var $x, $new;

      $x = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pmulp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.scaleDur($x);
      expect($new).to.be.calledWith($$("\\dur"), $x, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#addDur", sinon.test(function() {
      var instance, test;
      var $x, $new;

      $x = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.addDur($x);
      expect($new).to.be.calledWith($$("\\dur"), $x, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#stretch", sinon.test(function() {
      var instance, test;
      var $x, $new;

      $x = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pmulp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.stretch($x);
      expect($new).to.be.calledWith($$("\\stretch"), $x, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#lag", sinon.test(function() {
      var instance, test;
      var $t, $new;

      $t = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Plag").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.lag($t);
      expect($new).to.be.calledWith($t, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#legato", sinon.test(function() {
      var instance, test;
      var $x, $new;

      $x = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pmulp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.legato($x);
      expect($new).to.be.calledWith($$("\\legato"), $x, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#db", sinon.test(function() {
      var instance, test;
      var $db, $new;

      $db = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Paddp").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.db($db);
      expect($new).to.be.calledWith($$("\\db"), $db, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#clump", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pclump").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.clump($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#flatten", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pflatten").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.flatten($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#repeat", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pn").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.repeat($n);
      expect($new).to.be.calledWith(instance, $n);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#keep", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pfin").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.keep($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#drop", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pdrop").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.drop($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#stutter", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pstutter").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.stutter($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#finDur", sinon.test(function() {
      var instance, test;
      var $dur, $tolerance, $new;

      $dur = $$();
      $tolerance = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pfindur").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.finDur($dur, $tolerance);
      expect($new).to.be.calledWith($dur, instance, $tolerance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#fin", sinon.test(function() {
      var instance, test;
      var $n, $new;

      $n = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pfin").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.fin($n);
      expect($new).to.be.calledWith($n, instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#trace", sinon.test(function() {
      var instance, test;
      var $key, $printStream, $prefix, $new;

      $key = $$();
      $printStream = $$();
      $prefix = $$();
      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Ptrace").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.trace($key, $printStream, $prefix);
      expect($new).to.be.calledWith(instance, $key, $printStream, $prefix);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#differentiate", sinon.test(function() {
      var instance, test;
      var $new;

      $new = this.spy(sc.test.func());

      this.stub(klass, "get").withArgs("Pdiff").returns($$({
        new: $new
      }));

      instance = this.createInstance();

      test = instance.differentiate();
      expect($new).to.be.calledWith(instance);
      expect($new).to.be.calledLastIn(test);
    }));
    it.skip("#integrate", function() {
    });
    it.skip("#record", function() {
    });
  });

  describe("SCPseries", function() {
    var SCPseries;
    before(function() {
      SCPseries = $("Pseries");
      this.createInstance = function(start, step, length) {
        return SCPseries.new($$(start || 0), $$(step || 1), $$(length || Infinity));
      };
    });
    it("#asStream", function() {
      var r = this.createInstance(100, 10, 5).asStream();
      expect(r.next(), 0).to.be.a("SCInteger").that.equals(100);
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(110);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(120);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(130);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(140);
      expect(r.next(), 5).to.be.a("SCNil");
    });
    it("#asStream break", function() {
      var r = this.createInstance(100, $$(null)).asStream();
      expect(r.next(), 0).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

  describe("SCPgeom", function() {
    var SCPgeom;
    before(function() {
      SCPgeom = $("Pgeom");
      this.createInstance = function(start, grow, length) {
        return SCPgeom.new($$(start || 0), $$(grow || 1), $$(length || Infinity));
      };
    });
    it("#asStream", function() {
      var r = this.createInstance(1, 256, 5).asStream();
      expect(r.next(), 0).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(256);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(65536);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(16777216);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(0); // overflow
      expect(r.next(), 5).to.be.a("SCNil");
    });
    it("#asStream break", function() {
      var r = this.createInstance(1, $$(null)).asStream();
      expect(r.next(), 0).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

})();
