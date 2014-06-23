(function() {
  "use strict";

  require("./Nil");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  var SCNil = $("Nil");

  describe("SCNil", function() {
    before(function() {
      this.createInstance = function() {
        return $.Nil();
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_NIL);
    });
    it("#__num__", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.__num__();
      expect(test).to.be.a("JSNumber").that.equals(0);
    });
    it("#__bool__", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.__bool__();
      expect(test).to.be.a("JSBoolean").that.is.false;
    });
    it("#__sym__", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.__sym__();
      expect(test).to.be.a("JSString").that.equals("nil");
    });
    it("#toString", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("nil");
    });
    it(".new", function() {
      expect(function() {
        SCNil.new();
      }).to.throw("should use literal");
    });
    it("#isNil", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.isNil();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#notNil", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.notNil();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#?", function() {
      var instance, test;
      var $obj;

      $obj = $$();

      instance = this.createInstance();

      test = instance ["?"] ($obj);
      expect(test).to.equal($obj);
    });
    it("#??", function() {
      var instance, test;
      var $obj;

      $obj = $$({
        value: sc.test.func()
      });

      instance = this.createInstance();

      test = instance ["??"] ($obj);
      expect($obj.value).to.be.calledLastIn(test);
    });
    it("#!?", function() {
      var instance = this.createInstance();
      expect(instance["!?"]).to.doNothing;
    });
    it("#asBoolean", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.asBoolean();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#booleanValue", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.booleanValue();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#push", function() {
      var instance, test;
      var $function;

      $function = $$({
        value: sc.test.func()
      });

      instance = this.createInstance();

      test = instance.push($function);
      expect($function.value).to.be.calledLastIn(test);
    });
    it("#appendStream", function() {
      var instance, test;
      var $stream;

      $stream = $$();

      instance = this.createInstance();

      test = instance.appendStream($stream);
      expect(test).to.equal($stream);
    });
    it("#pop", function() {
      var instance = this.createInstance();
      expect(instance.pop).to.doNothing;
    });
    it("#source", function() {
      var instance = this.createInstance();
      expect(instance.source).to.doNothing;
    });
    it("#source_", function() {
      var instance = this.createInstance();
      expect(instance.source_).to.doNothing;
    });
    it("#rate", function() {
      var instance = this.createInstance();
      expect(instance.rate).to.doNothing;
    });
    it("#numChannels", function() {
      var instance = this.createInstance();
      expect(instance.numChannels).to.doNothing;
    });
    it("#isPlaying", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isPlaying();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#do", function() {
      var instance = this.createInstance();
      expect(instance.do).to.doNothing;
    });
    it("#reverseDo", function() {
      var instance = this.createInstance();
      expect(instance.reverseDo).to.doNothing;
    });
    it("#pairsDo", function() {
      var instance = this.createInstance();
      expect(instance.pairsDo).to.doNothing;
    });
    it("#collect", function() {
      var instance = this.createInstance();
      expect(instance.collect).to.doNothing;
    });
    it("#select", function() {
      var instance = this.createInstance();
      expect(instance.select).to.doNothing;
    });
    it("#reject", function() {
      var instance = this.createInstance();
      expect(instance.reject).to.doNothing;
    });
    it("#detect", function() {
      var instance = this.createInstance();
      expect(instance.detect).to.doNothing;
    });
    it("#collectAs", function() {
      var instance = this.createInstance();
      expect(instance.collectAs).to.doNothing;
    });
    it("#selectAs", function() {
      var instance = this.createInstance();
      expect(instance.selectAs).to.doNothing;
    });
    it("#rejectAs", function() {
      var instance = this.createInstance();
      expect(instance.rejectAs).to.doNothing;
    });
    it("#dependants", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("IdentitySet").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.dependants();
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#changed", function() {
      var instance = this.createInstance();
      expect(instance.changed).to.doNothing;
    });
    it("#addDependant", function() {
      var instance = this.createInstance();
      expect(instance.addDependant).to.doNothing;
    });
    it("#removeDependant", function() {
      var instance = this.createInstance();
      expect(instance.removeDependant).to.doNothing;
    });
    it("#release", function() {
      var instance = this.createInstance();
      expect(instance.release).to.doNothing;
    });
    it("#update", function() {
      var instance = this.createInstance();
      expect(instance.update).to.doNothing;
    });
    it("#transformEvent", function() {
      var instance, test;
      var $event;

      $event = $$();

      instance = this.createInstance();

      test = instance.transformEvent($event);
      expect(test).to.equal($event);
    });
    it("#awake", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.awake();
      expect(test).to.be.a("SCNil");
    });
    it("#play", function() {
      var instance = this.createInstance();
      expect(instance.play).to.doNothing;
    });
    it("#nextTimeOnGrid", sinon.test(function() {
      var instance, test;
      var $clock;

      $clock = $$(null);

      instance = this.createInstance();

      test = instance.nextTimeOnGrid($clock);
      expect(test).to.be.a("SCNil");

      $clock = $$();
      $clock.nextTimeOnGrid = this.spy(sc.test.func());

      test = instance.nextTimeOnGrid($clock);
      expect(test).to.be.a("SCFunction");
      expect($clock.nextTimeOnGrid).to.be.not.called;

      test = test.value();
      expect($clock.nextTimeOnGrid).to.be.calledLastIn(test);
    }));
    it("#asQuant", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func());
      this.stub(sc.lang.klass, "get").withArgs("Quant").returns($$({
        default: spy
      }));

      instance = this.createInstance();

      test = instance.asQuant();
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#swapThisGroup", function() {
      var instance = this.createInstance();
      expect(instance.swapThisGroup).to.doNothing;
    });
    it("#performMsg", function() {
      var instance = this.createInstance();
      expect(instance.swapThisGroup).to.doNothing;
    });
    it("printOn", sinon.test(function() {
      var instance, test;
      var $stream;

      $stream = $$({
        putAll: this.spy()
      });

      instance = this.createInstance();

      test = instance.printOn($stream);
      expect($stream.putAll.args[0]).to.eql($$([ "nil" ])._);
      expect(test).to.equal(instance);
    }));
    it("storeOn", sinon.test(function() {
      var instance, test;
      var $stream;

      $stream = $$({
        putAll: this.spy()
      });

      instance = this.createInstance();

      test = instance.storeOn($stream);
      expect($stream.putAll.args[0]).to.eql($$([ "nil" ])._);
      expect(test).to.equal(instance);
    }));
    it("#matchItem", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.matchItem();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#add", function() {
      var instance, test;
      var $value;

      $value = $$();

      instance = this.createInstance();

      test = instance.add($value);
      expect(test).to.be.a("SCArray").that.eql([ $value ]);
    });
    it("#addAll", function() {
      var instance, test;
      var $array;

      $array = $$();

      instance = this.createInstance();

      test = instance.addAll($array);
      expect(test).to.be.a("SCArray").that.eql([ $array ]);
    });
    it("#++", function() {
      var instance, test;
      var $array;

      $array = $$();

      instance = this.createInstance();

      test = instance ["++"] ($array);
      expect(test).to.be.a("SCArray").that.eql([ $array ]);
    });
    it("#asCollection", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asCollection();
      expect(test).to.be.a("SCArray").that.eql([]);
    });
    it("#remove", function() {
      var instance = this.createInstance();
      expect(instance.remove).to.doNothing;
    });
    it("#set", function() {
      var instance = this.createInstance();
      expect(instance.set).to.doNothing;
    });
    it("#get", function() {
      var instance, test;
      var $prevVal;

      $prevVal = $$();

      instance = this.createInstance();

      test = instance.get($prevVal);
      expect(test).to.equal($prevVal);
    });
    it("#addFunc", sinon.test(function() {
      var instance, test, stub;
      var $arg1, $arg2, $arg3;

      stub = this.stub(sc.lang.klass, "get");
      stub.withArgs("FunctionList").returns($$({
        new: function(arg) {
          return arg;
        }
      }));
      $arg1 = $$();
      $arg2 = $$();
      $arg3 = $$();

      instance = this.createInstance();
      test = instance.addFunc($arg1);
      expect(stub).to.be.not.called;
      expect(test).to.equal($arg1);

      instance = this.createInstance();
      test = instance.addFunc($arg1, $arg2, $arg3);
      expect(stub).to.be.called;
      expect(test).to.be.a("SCArray").that.eql([ $arg1, $arg2, $arg3 ]);
    }));
    it("#removeFunc", function() {
      var instance = this.createInstance();
      expect(instance.removeFunc).to.doNothing;
    });
    it("#replaceFunc", function() {
      var instance = this.createInstance();
      expect(instance.replaceFunc).to.doNothing;
    });
    it("#seconds_", function() {
      var instance = this.createInstance();
      expect(instance.seconds_).to.doNothing;
    });
    it("#throw", function() {
      var instance = this.createInstance();
      expect(instance.throw).to.doNothing;
    });
    it.skip("#handleError", function() {
    });
    it("#archiveAsCompileString", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.archiveAsCompileString();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#asSpec", sinon.test(function() {
      var instance, test, spy, stub;

      spy = this.spy(sc.test.func());
      stub = this.stub(sc.lang.klass, "get");
      stub.withArgs("ControlSpec").returns($$({
        new: spy
      }));

      instance = this.createInstance();

      test = instance.asSpec();
      expect(stub.getCall(0)).to.be.calledWith("ControlSpec");
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#superclassesDo", function() {
      var instance = this.createInstance();
      expect(instance.superclassesDo).to.doNothing;
    });
    it("#shallowCopy", function() {
      var instance = this.createInstance();
      expect(instance.shallowCopy).to.doNothing;
    });
  });
})();
