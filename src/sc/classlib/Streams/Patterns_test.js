(function() {
  "use strict";

  require("./Patterns");
  require("./ListPatterns");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var SCPattern = $("Pattern");
  var SCPseq = $("Pseq");

  describe("SCPattern", function() {
    before(function() {
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
      var $aPattern = $$();
      var SCPseq$new = this.spy(sc.test.func());


      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pseq").returns($$({
        new: SCPseq$new
      }));

      test = instance ["++"] ($aPattern);
      expect(SCPseq$new.args[0]).to.eqls($$([ [ instance, $aPattern ] ])._);
      expect(SCPseq$new).to.be.calledLastIn(test);
    }));
    it("#<>", sinon.test(function() {
      var instance, test;
      var $aPattern = $$();
      var SCPchain$new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("Pchain").returns($$({
        new: SCPchain$new
      }));

      instance = this.createInstance();

      test = instance ["<>"] ($aPattern);
      expect(SCPchain$new).to.be.calledWith(instance, $aPattern);
      expect(SCPchain$new).to.be.calledLastIn(test);
    }));
    it("#play", sinon.test(function() {
      var instance, test;
      var $clock = $$();
      var $protoEvent = $$();
      var $quant = $$();
      var $play = this.spy(sc.test.func());

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
      var $protoEvent = $$();
      var $stream = $$();
      var SCEventStreamPlayer$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("EventStreamPlayer").returns({
        new: SCEventStreamPlayer$new
      });
      this.stub(instance, "asStream").returns($stream);

      test = instance.asEventStreamPlayer($protoEvent);
      expect(SCEventStreamPlayer$new).to.be.calledWith($stream, $protoEvent);
      expect(SCEventStreamPlayer$new).to.be.calledLastIn(test);
    }));
    it("#embedInStream", sinon.test(function() {
      var instance, test;
      var $inval = $$();
      var $stream = $$({ embedInStream: this.spy() });

      instance = this.createInstance();
      this.stub(instance, "asStream").returns($stream);

      test = instance.embedInStream($inval);
      expect($stream.embedInStream).to.be.calledWith($inval);
      expect($stream.embedInStream).to.be.calledLastIn(test);
    }));
    it("#do", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var $stream = $$({ do: this.spy() });

      instance = this.createInstance();
      this.stub(instance, "asStream").returns($stream);

      test = instance.do($function);
      expect($stream.do).to.be.calledWith($function);
      expect($stream.do).to.be.calledLastIn(test);
    }));
    it("#collect", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var SCPcollect$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pcollect").returns($$({
        new: SCPcollect$new
      }));

      test = instance.collect($function);
      expect(SCPcollect$new).to.be.calledWith($function, instance);
      expect(SCPcollect$new).to.be.calledLastIn(test);
    }));
    it("#select", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var SCPselect$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pselect").returns($$({
        new: SCPselect$new
      }));

      test = instance.select($function);
      expect(SCPselect$new).to.be.calledWith($function, instance);
      expect(SCPselect$new).to.be.calledLastIn(test);
    }));
    it("#reject", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var SCPreject$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Preject").returns($$({
        new: SCPreject$new
      }));

      test = instance.reject($function);
      expect(SCPreject$new).to.be.calledWith($function, instance);
      expect(SCPreject$new).to.be.calledLastIn(test);
    }));
    it("#composeUnaryOp", sinon.test(function() {
      var instance, test;
      var $operator = $$();
      var SCPunop$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Punop").returns($$({
        new: SCPunop$new
      }));

      test = instance.composeUnaryOp($operator);
      expect(SCPunop$new).to.be.calledWith($operator, instance);
      expect(SCPunop$new).to.be.calledLastIn(test);
    }));
    it("#composeBinaryOp", sinon.test(function() {
      var instance, test;
      var $operator = $$();
      var $pattern  = $$();
      var $adverb   = $$();
      var SCPbinop$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pbinop").returns($$({
        new: SCPbinop$new
      }));

      test = instance.composeBinaryOp($operator, $pattern, $adverb);
      expect(SCPbinop$new).to.be.calledWith($operator, instance, $pattern, $adverb);
      expect(SCPbinop$new).to.be.calledLastIn(test);
    }));
    it("#reverseComposeBinaryOp", sinon.test(function() {
      var instance, test;
      var $operator = $$();
      var $pattern  = $$();
      var $adverb   = $$();
      var SCPbinop$new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("Pbinop").returns($$({
        new: SCPbinop$new
      }));

      instance = this.createInstance();

      test = instance.reverseComposeBinaryOp($operator, $pattern, $adverb);
      expect(SCPbinop$new).to.be.calledWith($operator, $pattern, instance, $adverb);
      expect(SCPbinop$new).to.be.calledLastIn(test);
    }));
    it("#composeNAryOp", sinon.test(function() {
      var instance, test;
      var $selector = $$();
      var $argList  = $$();
      var SCPnaryop$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pnaryop").returns($$({
        new: SCPnaryop$new
      }));

      test = instance.composeNAryOp($selector, $argList);
      expect(SCPnaryop$new).to.be.calledWith($selector, instance, $argList);
      expect(SCPnaryop$new).to.be.calledLastIn(test);
    }));
    it("#mtranspose", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      test = instance.mtranspose($n);
      expect(SCPaddp$new).to.be.calledWith($$("\\mtranspose"), $n, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#ctranspose", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      instance = this.createInstance();

      test = instance.ctranspose($n);
      expect(SCPaddp$new).to.be.calledWith($$("\\ctranspose"), $n, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#gtranspose", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      test = instance.gtranspose($n);
      expect(SCPaddp$new).to.be.calledWith($$("\\gtranspose"), $n, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#detune", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      test = instance.detune($n);
      expect(SCPaddp$new).to.be.calledWith($$("\\detune"), $n, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#scaleDur", sinon.test(function() {
      var instance, test;
      var $x = $$();
      var SCPmulp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pmulp").returns($$({
        new: SCPmulp$new
      }));

      test = instance.scaleDur($x);
      expect(SCPmulp$new).to.be.calledWith($$("\\dur"), $x, instance);
      expect(SCPmulp$new).to.be.calledLastIn(test);
    }));
    it("#addDur", sinon.test(function() {
      var instance, test;
      var $x = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      test = instance.addDur($x);
      expect(SCPaddp$new).to.be.calledWith($$("\\dur"), $x, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#stretch", sinon.test(function() {
      var instance, test;
      var $x = $$();
      var SCPmulp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pmulp").returns($$({
        new: SCPmulp$new
      }));

      test = instance.stretch($x);
      expect(SCPmulp$new).to.be.calledWith($$("\\stretch"), $x, instance);
      expect(SCPmulp$new).to.be.calledLastIn(test);
    }));
    it("#lag", sinon.test(function() {
      var instance, test;
      var $t = $$();
      var SCPlag$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Plag").returns($$({
        new: SCPlag$new
      }));

      test = instance.lag($t);
      expect(SCPlag$new).to.be.calledWith($t, instance);
      expect(SCPlag$new).to.be.calledLastIn(test);
    }));
    it("#legato", sinon.test(function() {
      var instance, test;
      var $x = $$();
      var SCPmulp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pmulp").returns($$({
        new: SCPmulp$new
      }));

      test = instance.legato($x);
      expect(SCPmulp$new).to.be.calledWith($$("\\legato"), $x, instance);
      expect(SCPmulp$new).to.be.calledLastIn(test);
    }));
    it("#db", sinon.test(function() {
      var instance, test;
      var $db = $$();
      var SCPaddp$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Paddp").returns($$({
        new: SCPaddp$new
      }));

      test = instance.db($db);
      expect(SCPaddp$new).to.be.calledWith($$("\\db"), $db, instance);
      expect(SCPaddp$new).to.be.calledLastIn(test);
    }));
    it("#clump", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPclump$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pclump").returns($$({
        new: SCPclump$new
      }));

      test = instance.clump($n);
      expect(SCPclump$new).to.be.calledWith($n, instance);
      expect(SCPclump$new).to.be.calledLastIn(test);
    }));
    it("#flatten", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPflatten$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pflatten").returns($$({
        new: SCPflatten$new
      }));

      test = instance.flatten($n);
      expect(SCPflatten$new).to.be.calledWith($n, instance);
      expect(SCPflatten$new).to.be.calledLastIn(test);
    }));
    it("#repeat", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPn$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pn").returns($$({
        new: SCPn$new
      }));

      test = instance.repeat($n);
      expect(SCPn$new).to.be.calledWith(instance, $n);
      expect(SCPn$new).to.be.calledLastIn(test);
    }));
    it("#keep", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPfin$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pfin").returns($$({
        new: SCPfin$new
      }));

      test = instance.keep($n);
      expect(SCPfin$new).to.be.calledWith($n, instance);
      expect(SCPfin$new).to.be.calledLastIn(test);
    }));
    it("#drop", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPdrop$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pdrop").returns($$({
        new: SCPdrop$new
      }));

      test = instance.drop($n);
      expect(SCPdrop$new).to.be.calledWith($n, instance);
      expect(SCPdrop$new).to.be.calledLastIn(test);
    }));
    it("#stutter", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPstutter$new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("Pstutter").returns($$({
        new: SCPstutter$new
      }));

      instance = this.createInstance();

      test = instance.stutter($n);
      expect(SCPstutter$new).to.be.calledWith($n, instance);
      expect(SCPstutter$new).to.be.calledLastIn(test);
    }));
    it("#finDur", sinon.test(function() {
      var instance, test;
      var $dur = $$();
      var $tolerance = $$();
      var SCPfindur$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pfindur").returns($$({
        new: SCPfindur$new
      }));

      test = instance.finDur($dur, $tolerance);
      expect(SCPfindur$new).to.be.calledWith($dur, instance, $tolerance);
      expect(SCPfindur$new).to.be.calledLastIn(test);
    }));
    it("#fin", sinon.test(function() {
      var instance, test;
      var $n = $$();
      var SCPfin$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pfin").returns($$({
        new: SCPfin$new
      }));

      test = instance.fin($n);
      expect(SCPfin$new).to.be.calledWith($n, instance);
      expect(SCPfin$new).to.be.calledLastIn(test);
    }));
    it("#trace", sinon.test(function() {
      var instance, test;
      var $key = $$();
      var $printStream = $$();
      var $prefix = $$();
      var SCPtrace$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Ptrace").returns($$({
        new: SCPtrace$new
      }));

      test = instance.trace($key, $printStream, $prefix);
      expect(SCPtrace$new).to.be.calledWith(instance, $key, $printStream, $prefix);
      expect(SCPtrace$new).to.be.calledLastIn(test);
    }));
    it("#differentiate", sinon.test(function() {
      var instance, test;
      var SCPdiff$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pdiff").returns($$({
        new: SCPdiff$new
      }));

      test = instance.differentiate();
      expect(SCPdiff$new).to.be.calledWith(instance);
      expect(SCPdiff$new).to.be.calledLastIn(test);
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
