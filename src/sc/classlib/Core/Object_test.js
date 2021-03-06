describe("Core/Object", function() {
  "use strict";

  var testCase = sc.test.testCase;
  var $$ = sc.test.object;
  var $  = sc.lang.$;
  var SCObject = $("Object");
  var SCRoutine = $("Routine");

  describe("SCObject", function() {
    before(function() {
      this.createInstance = function(instance) {
        return $$($$(instance), "Object" + this.test.title);
      };
    });

    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_OBJ);
    });

    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      // test = $nil.valueOf();
      // expect(test).to.be.a("JSNull");

      test = instance.valueOf();
      expect(test).to.equal(instance);
    });

    it("#toString", function() {
      var instance, test;

      instance = this.createInstance();
      //
      // test = $nil.toString();
      // expect(test).to.be.a("JSString").that.equals("nil");

      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("an Object");
    });

    it("#toJSON", function() {
      var test, json;

      test = $$(null).toJSON();
      expect(test).to.be.a("JSString");

      json = JSON.parse(test);
      expect(json.class).to.equal("Nil");
    });

    it("#__num__", function() {
      var instance;

      instance = this.createInstance();

      expect(function() {
        instance.__num__();
      }).to.throw(Error, "cannot be converted to a Number");
    });

    it("#__int__", function() {
      var instance, test;

      instance = this.createInstance();
      instance.__num__ = function() {
        return Math.PI;
      };

      test = instance.__int__();
      expect(test).to.be.a("JSNumber").that.equals(3);
    });

    it("#__bool__", function() {
      var instance;

      instance = this.createInstance();

      expect(function() {
        instance.__bool__();
      }).to.throw(Error, "cannot be converted to a Boolean");
    });

    it("#__sym__", function() {
      var instance;

      instance = this.createInstance();

      expect(function() {
        instance.__sym__();
      }).to.throw(Error, "cannot be converted to a Symbol");
    });

    it("#__str__", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__str__();
      expect(test).to.be.a("JSString").that.equals("an Object");
    });

    it(".newFrom", function() {
      expect(function() {
        SCObject.newFrom();
      }).to.throw(Error, "understood");
    });
    it.skip("#dump", function() {
    });

    it("#post", sinon.test(function() {
      var instance, test;
      var SCString$post = this.spy();

      instance = this.createInstance();
      this.stub(instance, "asString").returns({ post: SCString$post });

      test = instance.post();
      expect(test).to.equal(instance);
      expect(SCString$post).to.be.calledWith(undefined);
    }));

    it("#postln", sinon.test(function() {
      var instance, test;
      var SCString$postln = this.spy();

      instance = this.createInstance();
      this.stub(instance, "asString").returns({ postln: SCString$postln });

      test = instance.postln();
      expect(test).to.equal(instance);
      expect(SCString$postln).to.be.calledWith(undefined);
    }));

    it("#postc", sinon.test(function() {
      var instance, test;
      var SCString$postc = this.spy();

      instance = this.createInstance();
      this.stub(instance, "asString").returns({ postc: SCString$postc });

      test = instance.postc();
      expect(test).to.equal(instance);
      expect(SCString$postc).to.be.calledWith(undefined);
    }));

    it("#postcln", sinon.test(function() {
      var instance, test;
      var SCString$postcln = this.spy();

      instance = this.createInstance();
      this.stub(instance, "asString").returns({ postcln: SCString$postcln });

      test = instance.postcln();
      expect(test).to.equal(instance);
      expect(SCString$postcln).to.be.calledWith(undefined);
    }));
    it.skip("#postcs", function() {
    });
    it.skip("#totalFree", function() {
    });
    it.skip("#largestFreeBlock", function() {
    });
    it.skip("#gcDumpGrey", function() {
    });
    it.skip("#gcDumpSet", function() {
    });
    it.skip("#gcInfo", function() {
    });
    it.skip("#gcSanity", function() {
    });
    it.skip("#canCallOS", function() {
    });

    it("#size", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.size();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });

    it("#indexedSize", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.indexedSize();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });

    it("#flatSize", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.flatSize();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });

    it("#do", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $function = $$();

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "object$do").returns(iter);
      this.stub(sc.lang.iterator, "execute");

      test = instance.do($function);
      expect(sc.lang.iterator.object$do).to.be.calledWith(instance);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));

    it("#generate", sinon.test(function() {
      var instance, test;
      var $function = $$();
      var $state = $$();

      instance = this.createInstance();
      this.stub(instance, "do");

      test = instance.generate($function, $state);
      expect(instance.do).to.be.calledWith($function);
      expect(test).to.equal($state);
    }));

    it("#class", function() {
      var instance,test;

      instance = this.createInstance();
      test = instance.class();

      expect(test).to.equal(SCObject);
    });

    it("#isKindOf", function() {
      var instance, test;

      instance = $$(null);
      test = instance.isKindOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.true;

      instance = $$(null);
      test = instance.isKindOf($("Nil"));
      expect(test).to.be.a("SCBoolean").that.is.true;

      instance = this.createInstance();
      test = instance.isKindOf($("Nil"));
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#isMemberOf", function() {
      var instance, test;

      instance = $$(null);
      test = instance.isMemberOf(SCObject);
      expect(test).to.be.a("SCBoolean").that.is.false;

      instance = $$(null);
      test = instance.isMemberOf($("Nil"));
      expect(test).to.be.a("SCBoolean").that.is.true;

      instance = this.createInstance();
      test = instance.isMemberOf($("Nil"));
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#respondsTo", function() {
      testCase(this, [
        [ null, [ "\\respondsTo" ], true  ],
        [ null, [ "\\undefined"  ], false ],
        [ null, [ [ "\\respondsTo", "\\size" ] ], true  ],
        [ null, [ [ "\\undefined" , "\\size" ] ], false ],
      ]);
    });

    it("#performMsg", sinon.test(function() {
      var instance, test;
      var $selector = $$("\\size");
      var $arg1     = $$();
      var $arg2     = $$();

      instance = this.createInstance();
      this.stub(instance, "size", sc.test.func());

      test = instance.performMsg($$([ $selector, $arg1, $arg2 ]));
      expect(instance.size).to.be.calledWith($arg1, $arg2);
      expect(instance.size).to.be.calledLastIn(test);

      expect(function() {
        instance.performMsg($$( [ "\\not-understood" ]));
      }).to.throw("not understood");
    }));

    it("#perform", sinon.test(function() {
      var instance, test;
      var $selector = $$("\\size");
      var $arg1     = $$();
      var $arg2     = $$();

      instance = this.createInstance();
      this.stub(instance, "size", sc.test.func());

      test = instance.perform($selector, $arg1, $arg2);
      expect(instance.size).to.be.calledWith($arg1, $arg2);
      expect(instance.size).to.be.calledLastIn(test);

      expect(function() {
        instance.perform($$("\\not-understood"));
      }).to.throw("not understood");
    }));

    it("#performList", sinon.test(function() {
      var instance, test;
      var $selector = $$("\\size");
      var $arg1     = $$();
      var $arg2     = $$();
      var $arglist  = $$([ $arg1, $arg2 ]);

      instance = this.createInstance();
      this.stub(instance, "size", sc.test.func());

      test = instance.performList($selector, $arglist);
      expect(instance.size).to.be.calledWith($arg1, $arg2);
      expect(instance.size).to.be.calledLastIn(test);

      expect(function() {
        instance.performList($$("\\not-understood"));
      }).to.throw("not understood");
    }));

    it("#functionPerformList", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.functionPerformList).to.doNothing;
    });
    it.skip("#superPerform", function() {
    });
    it.skip("#superPerformList", function() {
    });

    it("#tryPerform", sinon.test(function() {
      var instance, test;
      var $selector = $$("\\size");
      var $arg1     = $$();
      var $arg2     = $$();

      instance = this.createInstance();
      this.stub(instance, "size", sc.test.func());

      test = instance.tryPerform($selector, $arg1, $arg2);
      expect(instance.size).to.be.calledWith($arg1, $arg2);
      expect(instance.size).to.be.calledLastIn(test);

      test = instance.tryPerform($$("\\not-understood"));
      expect(test).to.be.a("SCNil");
    }));

    it("#multiChannelPerform", function() {
      var instance, test;

      instance = this.createInstance([ 10, 20, 30 ]);

      test = instance.multiChannelPerform(
        $$("\\clip"), $$(15), $$([ 20, 25, 20 ])
      );
      expect(test).to.be.a("SCArray").that.deep.equals([ 15, 20, 20 ]);
    });
    it.skip("#performWithEnvir", function() {
    });
    it.skip("#performKeyValuePairs", function() {
    });

    it("#copy", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      instance.shallowCopy = this.spy(sc.test.func());

      test = instance.copy();
      expect(instance.shallowCopy).to.be.calledLastIn(test);
    }));
    it.skip("#contentsCopy", function() {
    });

    it("#shallowCopy", function() {
      var instance, test;

      instance = this.createInstance($$([]));
      instance._scalar = 100;
      instance._array  = [ 1, 2, 3 ];
      instance._object = { a: 10, b: 20, c: 30 };

      test = instance.shallowCopy();

      expect(test).to.not.equal(instance);
      expect(test).to.deep.equal(instance);

      expect(test._scalar).to.equal(instance._scalar);
      expect(test._array ).to.not.equal(instance._array);
      expect(test._array ).to.deep.equal(instance._array);
      expect(test._object).to.not.equal(instance._object);
      expect(test._object).to.deep.equal(instance._object);

      instance = this.createInstance();
      test = instance.shallowCopy();
      expect(test).to.not.equal(instance);
      expect(test).to.deep.equal(instance);
    });
    it.skip("#copyImmutable", function() {
    });
    it.skip("#deepCopy", function() {
    });

    it("#dup", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.dup();
      expect(test).to.be.a("SCArray").that.deep.equals([ instance, instance ]);

      instance = this.createInstance();
      test = instance.dup($$(3));
      expect(test).to.be.a("SCArray").that.deep.equals([ instance, instance, instance ]);

      instance = this.createInstance();
      test = instance.dup($$([ 3, 3 ]));
      expect(test).to.be.a("SCArray").that.deep.equals([
        [ instance, instance, instance ],
        [ instance, instance, instance ],
        [ instance, instance, instance ],
      ]);
    });

    it("#!", sinon.test(function() {
      var instance, test;
      var $n = $$();

      instance = this.createInstance();
      this.stub(instance, "dup", sc.test.func());

      test = instance ["!"] ($n);
      expect(instance.dup).to.be.calledWith($n);
      expect(instance.dup).to.be.calledLastIn(test);
    }));

    it("#poll", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "value", sc.test.func());

      test = instance.poll();
      expect(instance.value).to.be.calledLastIn(test);
    }));

    it("#value", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.value).to.doNothing;
    });

    it("#valueArray", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.valueArray).to.doNothing;
    });

    it("#valueEnvir", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.valueEnvir).to.doNothing;
    });

    it("#valueArrayEnvir", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.valueArrayEnvir).to.doNothing;
    });

    it("#==", sinon.test(function() {
      var instance, test;
      var $obj = $$();

      instance = this.createInstance();
      this.stub(instance, "===", sc.test.func());

      test = instance ["=="] ($obj);
      expect(instance["==="]).to.be.calledWith($obj);
      expect(instance["==="]).to.be.calledLastIn(test);
    }));

    it("#!=", sinon.test(function() {
      var instance, test;
      var $obj = $$();
      var SCBoolean$not = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(instance, "==").returns($$({ not: SCBoolean$not }));

      test = instance ["!="] ($obj);
      expect(instance["=="]).to.be.calledWith($obj);
      expect(SCBoolean$not).to.be.calledLastIn(test);
    }));

    it("#===", function() {
      var instance, test;

      instance = this.createInstance();
      [
        [ instance      , true  ],
        [ SCObject.new(), false ],
      ].forEach(function(items) {
        test = instance ["==="] (items[0]);
        expect(test).to.be.a("SCBoolean").that.equals(items[1]);
      }, this);
    });

    it("#!==", function() {
      var instance, test;

      instance = this.createInstance();
      [
        [ instance      , false ],
        [ SCObject.new(), true  ],
      ].forEach(function(items) {
        test = instance ["!=="] (items[0]);
        expect(test).to.be.a("SCBoolean").that.equals(items[1]);
      }, this);
    });

    it("#equals", function() {
      testCase(this, [
        [ 10, [ 10 ], true ],
        [ null, [ [], [ "\\size" ] ], true ],
        [ null, [ [], [ "\\size", "\\undefined" ] ], false ],
        [ null, [ [], [ "\\size", "\\at" ] ], false ],
        [ [], [ null, [ "\\size", "\\at" ] ], false ],
        [ 10, [ $.Float(10.0) ], true ],
      ]);
    });
    it.skip("#compareObject", function() {
    });
    it.skip("#instVarHash", function() {
    });

    it("#basicHash", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.basicHash();
      expect(test).to.be.a("SCInteger");
    });

    it("#hash", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.hash();
      expect(test).to.be.a("SCInteger");
    });

    it("#identityHash", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.identityHash();
      expect(test).to.be.a("SCInteger");
    });

    it("#->", function() {
      var instance, test;
      var $obj = $$();

      instance = this.createInstance();

      test = instance ["->"] ($obj);
      expect(test).to.be.a("SCAssociation");
    });

    it("#next", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.next).to.doNothing;
    });

    it("#reset", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.reset).to.doNothing;
    });

    it("#first", sinon.test(function() {
      var instance, test;
      var $inval = $$();

      instance = this.createInstance();
      this.stub(instance, "reset");
      this.stub(instance, "next", sc.test.func());

      test = instance.first($inval);
      expect(instance.reset).to.be.calledBefore(instance.next);
      expect(instance.next).to.be.calledWith($inval);
      expect(instance.next).to.be.calledLastIn(test);
    }));

    it("#iter", sinon.test(function() {
      var instance, test;
      var SCOneShotStream$new = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("OneShotStream").returns($$({
        new: SCOneShotStream$new
      }));

      test = instance.iter();
      expect(SCOneShotStream$new ).to.be.calledWith(instance);
      expect(SCOneShotStream$new ).to.be.calledLastIn(test);
    }));

    it("#stop", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.stop).to.doNothing;
    });

    it("#free", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.free).to.doNothing;
    });

    it("#clear", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.clear).to.doNothing;
    });

    it("#removedFromScheduler", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.removedFromScheduler).to.doNothing;
    });

    it("#isPlaying", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isPlaying();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#embedInStream", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "yield", sc.test.func());

      test = instance.embedInStream();
      expect(instance.yield).to.be.calledLastIn(test);
    }));

    it("#cyc", function() {
      var r = this.createInstance(SCRoutine.new($$(function() {
        return $$([ 1, 2 ]).do($$(function($_) {
          return $_.yield();
        }));
      }))).cyc($$(3));

      expect(r.next(), 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(2);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(2);
      expect(r.next(), 5).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 6).to.be.a("SCInteger").that.equals(2);
      expect(r.next(), 7).to.be.a("SCNil");
      expect(r.next(), 8).to.be.a("SCNil");
    });

    it("#fin [ 1, 2, 3 ]", function() {
      var r = this.createInstance(SCRoutine.new($$(function() {
        return $$([ 1, 2, 3 ]).do($$(function($_) {
          return $_.yield();
        }));
      }))).fin();

      expect(r.next(), 1).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 2).to.be.a("SCNil");
      expect(r.next(), 3).to.be.a("SCNil");
    });

    it("#fin [ nil ]", function() {
      var r = this.createInstance(SCRoutine.new($$(function() {
        return $$([ null ]).do($$(function($_) {
          return $_.yield();
        }));
      }))).fin();

      expect(r.next(), 1).to.be.a("SCNil");
      expect(r.next(), 2).to.be.a("SCNil");
    });

    it("#repeat", sinon.test(function() {
      var instance, test;
      var $repeats = $$();
      var SCPn$new = this.spy(function() {
        return { asStream: SCObject$asStream };
      });
      var SCObject$asStream = sc.test.func();

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Pn").returns({
        new: SCPn$new
      });

      test = instance.repeat($repeats);
      expect(SCPn$new.args[0]).to.deep.equal($$([ instance, $repeats ])._);
      expect(SCObject$asStream).to.be.calledLastIn(test);
    }));

    it("#loop", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "repeat", sc.test.func());

      test = instance.loop();
      expect(instance.repeat.args[0]).to.deep.equal($$([ Infinity ])._);
      expect(instance.repeat).to.be.calledLastIn(test);
    }));

    it("#asStream", function() {
      var instance = this.createInstance();
      expect(instance.asStream).to.doNothing;
    });

    it("#streamArg true", function() {
      var r = this.createInstance(
        $("Pseq").new($$([ 10, 20, 30 ]))
      ).streamArg($$(true));

      expect(r.next(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(20);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(30);
      expect(r.next(), 4).to.be.a("SCNil");
    });

    it("#streamArg false", function() {
      var r = this.createInstance(
        $("Pseq").new($$([ 10, 20, 30 ])).asStream()
      ).streamArg($$(false));

      expect(r.next(), 1).to.be.a("SCInteger").that.equals(10);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(20);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(30);
      expect(r.next(), 4).to.be.a("SCNil");
    });

    it("#eventAt", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.eventAt();
      expect(test).to.be.a("SCNil");
    });

    it("#composeEvents", function() {
      var instance, test;
      var $event = $$({ copy: sc.test.func() });

      instance = this.createInstance();

      test = instance.composeEvents($event);
      expect($event.copy).to.be.calledLastIn(test);
    });

    it("#finishEvent", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.finishEvent).to.doNothing;
    });

    it("#atLimit", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.atLimit();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#isRest", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isRest();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#threadPlayer", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.threadPlayer).to.doNothing;
    });

    it("#threadPlayer_", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.threadPlayer_).to.doNothing;
    });

    it("#?", function() {
      var instance;

      instance = this.createInstance();
      expect(instance["?"]).to.doNothing;
    });

    it("#??", function() {
      var instance;

      instance = this.createInstance();
      expect(instance["??"]).to.doNothing;
    });

    it("#!?", sinon.test(function() {
      var instance, test;
      var $obj = $$({ value: this.spy(sc.test.func()) });

      instance = this.createInstance();

      test = instance ["!?"] ($obj);
      expect($obj.value).to.be.calledWith(instance);
      expect($obj.value).to.be.calledLastIn(test);
    }));

    it("#isNil", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#notNil", function() {
      testCase(this, [
        [ null, [], true ]
      ]);
    });

    it("#isNumber", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isInteger", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isFloat", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isSequenceableCollection", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isCollection", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isArray", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isString", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#containsSeqColl", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isValidUGenInput", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isException", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#isFunction", function() {
      testCase(this, [
        [ null, [], false ]
      ]);
    });

    it("#matchItem", sinon.test(function() {
      var instance, test;
      var $item = $$();

      instance = this.createInstance();
      this.stub(instance, "===", sc.test.func());

      test = instance.matchItem($item);
      expect(instance["==="]).to.be.calledWith($item);
      expect(instance["==="]).to.be.calledLastIn(test);
    }));

    it("#trueAt", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.trueAt();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#falseAt", sinon.test(function() {
      var instance, test;
      var $key = $$();
      var SCBoolean$not = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(instance, "trueAt", function() {
        return $$({ not: SCBoolean$not });
      });

      test = instance.falseAt($key);
      expect(instance.trueAt).to.be.calledWith($key);
      expect(SCBoolean$not).to.be.calledLastIn(test);
    }));
    it.skip("#pointsTo", function() {
    });
    it.skip("#mutable", function() {
    });
    it.skip("#frozen", function() {
    });
    it.skip("#halt", function() {
    });
    it.skip("#primitiveFailed", function() {
    });
    it.skip("#reportError", function() {
    });
    it.skip("#shouldNotImplement", function() {
    });
    it.skip("#outOfContextReturn", function() {
    });
    it.skip("#immutableError", function() {
    });
    it.skip("#deprecated", function() {
    });
    it.skip("#mustBeBoolean", function() {
    });
    it.skip("#notYetImplemented", function() {
    });
    it.skip("#dumpBackTrace", function() {
    });
    it.skip("#getBackTrace", function() {
    });
    it.skip("#throw", function() {
    });

    it("#species", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "class", sc.test.func());

      test = instance.species();
      expect(instance.class).to.be.calledLastIn(test);
    }));

    it("#asCollection", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asCollection();
      expect(test).to.be.a("SCArray").that.deep.equal([ instance ]);
    });

    it("#asSymbol", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asSymbol();
      expect(test).to.be.a("SCSymbol").that.equals("an Object");
    });

    it("#asString", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asString();
      expect(test).to.be.a("SCString").that.equals("an Object");
    });
    it.skip("#asCompileString", function() {
    });
    it.skip("#cs", function() {
    });
    it.skip("#printClassNameOn", function() {
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#storeParamsOn", function() {
    });
    it.skip("#simplifyStoreArgs", function() {
    });
    it.skip("#storeArgs", function() {
    });
    it.skip("#storeModifiersOn", function() {
    });

    it("#as", sinon.test(function() {
      var instance, test;
      var $aSimilarClass = $$({
        newFrom: this.spy(sc.test.func())
      });

      instance = this.createInstance();

      test = instance.as($aSimilarClass);
      expect($aSimilarClass.newFrom).to.be.calledWith(instance);
      expect($aSimilarClass.newFrom).to.be.calledLastIn(test);
    }));

    it("#dereference", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.dereference).to.doNothing;
    });

    it("#reference", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub($, "Ref", sc.test.func());

      test = instance.reference();
      expect($.Ref).to.be.calledWith(instance);
      expect($.Ref).to.be.calledLastIn(test);
    }));

    it("#asRef", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub($, "Ref", sc.test.func());

      test = instance.asRef();
      expect($.Ref).to.be.calledWith(instance);
      expect($.Ref).to.be.calledLastIn(test);
    }));

    it("#asArray", sinon.test(function() {
      var instance, test;
      var SCCollection$asArray = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(instance, "asCollection", function() {
        return $$({ asArray: SCCollection$asArray });
      });

      test = instance.asArray();
      expect(SCCollection$asArray).to.be.calledLastIn(test);
    }));

    it("#asSequenceableCollection", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(instance, "asArray", sc.test.func());

      test = instance.asSequenceableCollection();
      expect(instance.asArray).to.be.calledLastIn(test);
    }));

    it("#rank", function() {
      testCase(this, [
        [ null, [], 0 ]
      ]);
    });

    it("#deepCollect", sinon.test(function() {
      var instance, test;
      var $depth    = $$();
      var $function = $$();
      var $index    = $$();
      var $rank     = $$();

      instance = this.createInstance();
      this.stub($function, "value", sc.test.func());

      test = instance.deepCollect($depth, $function, $index, $rank);
      expect($function.value).to.be.calledWith(instance, $index, $rank);
      expect($function.value).to.be.calledLastIn(test);
    }));

    it("#deepDo", sinon.test(function() {
      var instance, test;
      var $depth    = $$();
      var $function = $$();
      var $index    = $$();
      var $rank     = $$();

      instance = this.createInstance();
      this.stub($function, "value", sc.test.func());

      test = instance.deepDo($depth, $function, $index, $rank);
      expect($function.value).to.be.calledWith(instance, $index, $rank);
      expect(test).to.equal(instance);
    }));

    it("#slice", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.slice).to.doNothing;
    });

    it("#shape", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.shape();
      expect(test).to.be.a("SCNil");
    });

    it("#unbubble", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.unbubble).to.doNothing;
    });

    it("#bubble", function() {
      var instance, test;
      var $depth  = $$();
      var $levels = $$(3);

      instance = this.createInstance();

      test = instance.bubble($depth, $levels);
      expect(test).to.be.a("SCArray").that.deep.equals([ [ [ instance ] ] ]);
    });

    it("#obtain", function() {
      testCase(this, [
        {
          source: $$(10),
          args: [ 0, 100 ],
          result: 10
        },
        {
          source: $$(10),
          args: [ 1, 100 ],
          result: 100
        },
      ]);
    });

    it("#instill", function() {
      testCase(this, [
        {
          source: $$(10),
          args: [ 5, 30, 20 ],
          result: [ 10, 20, 20, 20, 20, 30 ]
        },
        {
          source: $$(10),
          args: [ 0, 30, 20 ],
          result: 30
        },
      ]);
    });

    it("#addFunc", sinon.test(function() {
      var instance, test;
      var $elem = $$();
      var $arg1 = $$();
      var $arg2 = $$();
      var SCFunctionList$new = this.spy(sc.test.func());

      instance = this.createInstance($$([ $elem ]));
      this.stub(sc.lang.klass, "get").withArgs("FunctionList").returns($$({
        new: SCFunctionList$new
      }));

      test = instance.addFunc($arg1, $arg2);
      expect(SCFunctionList$new.args[0]).to.deep.equal($$([ [ $elem, $arg1, $arg2 ] ])._);
      expect(SCFunctionList$new).to.be.calledLastIn(test);
    }));

    it("#removeFunc", function() {
      var instance, test;
      var $function = $$();

      instance = this.createInstance();

      test = instance.removeFunc($function);
      expect(test).to.equal(instance);

      test = instance.removeFunc(instance);
      expect(test).to.be.a("SCNil");
    });

    it("#replaceFunc", function() {
      var instance, test;
      var $function = $$();
      var $replace  = $$();

      instance = this.createInstance();

      test = instance.replaceFunc($function, $replace);
      expect(test).to.equal(instance);

      test = instance.replaceFunc(instance, $replace);
      expect(test).to.equal($replace);
    });
    it.skip("#addFuncTo", function() {
    });
    it.skip("#removeFuncFrom", function() {
    });

    it("#while", sinon.test(function() {
      var instance, test;
      var count = 0;
      var $body = $$({ value: this.spy() });

      instance = this.createInstance($$(function() {
        return $$(count++ < 2);
      }));

      test = instance.while($body);
      expect(test).to.equal(instance);
      expect($body.value).to.callCount(2);
    }));

    it("#switch", function() {
      testCase(this, [
        {
          source: $$(3),
          args: [
            0, "\\zero",
            1, "\\one",
            2, "\\two",
            3, "\\three",
            4, "\\four",
            "\\others"
          ],
          result: "\\three"
        },
        {
          source: $$(9),
          args: [
            0, "\\zero",
            1, "\\one",
            2, "\\two",
            3, "\\three",
            4, "\\four",
            "\\others"
          ],
          result: "\\others"
        },
        {
          source: $$(9),
          args: [
            0, "\\zero",
            1, "\\one",
            2, "\\two",
            3, "\\three",
            4, "\\four",
          ],
          result: null
        },
      ]);
    });

    it("#yield", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(sc.lang.bytecode, "yield");

      test = instance.yield();
      expect(test).to.be.a("SCNil");
      expect(sc.lang.bytecode.yield).to.be.calledWith(instance);
    }));

    it("#alwaysYield", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(sc.lang.bytecode, "alwaysYield");

      test = instance.alwaysYield();
      expect(test).to.be.a("SCNil");
      expect(sc.lang.bytecode.alwaysYield).to.be.calledWith(instance);
    }));

    it("#yieldAndReset true", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(sc.lang.bytecode, "yieldAndReset");
      this.stub(sc.lang.bytecode, "yield");

      test = instance.yieldAndReset($$(true));
      expect(test).to.be.a("SCNil");
      expect(sc.lang.bytecode.yieldAndReset).to.be.calledWith(instance);
      expect(sc.lang.bytecode.yield).to.be.not.called;
    }));

    it("#yieldAndReset null", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(sc.lang.bytecode, "yieldAndReset");
      this.stub(sc.lang.bytecode, "yield");

      test = instance.yieldAndReset();
      expect(test).to.be.a("SCNil");
      expect(sc.lang.bytecode.yieldAndReset).to.be.calledWith(instance);
      expect(sc.lang.bytecode.yield).to.be.not.called;
    }));

    it("#yieldAndReset false", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      this.stub(sc.lang.bytecode, "yieldAndReset");
      this.stub(sc.lang.bytecode, "yield");

      test = instance.yieldAndReset($$(false));
      expect(test).to.be.a("SCNil");
      expect(sc.lang.bytecode.yieldAndReset).to.be.not.called;
      expect(sc.lang.bytecode.yield).to.be.calledWith(instance);
    }));
    it.skip("#idle", function() {
    });
    it.skip("#dependants", function() {
    });
    it.skip("#changed", function() {
    });
    it.skip("#addDependant", function() {
    });
    it.skip("#removeDependant", function() {
    });
    it.skip("#release", function() {
    });
    it.skip("#releaseDependants", function() {
    });
    it.skip("#update", function() {
    });
    it.skip("#addUniqueMethod", function() {
    });
    it.skip("#removeUniqueMethods", function() {
    });
    it.skip("#removeUniqueMethod", function() {
    });
    it.skip("#inspect", function() {
    });
    it.skip("#inspectorClass", function() {
    });
    it.skip("#inspector", function() {
    });
    it.skip("#crash", function() {
    });
    it.skip("#stackDepth", function() {
    });
    it.skip("#dumpStack", function() {
    });
    it.skip("#dumpDetailedBackTrace", function() {
    });
    it.skip("#freeze", function() {
    });

    it("#&", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.bitAnd = this.spy(sc.test.func());

      test = instance ["&"] ($that);
      expect(instance.bitAnd).to.be.calledWith($that);
      expect(instance.bitAnd).to.be.calledLastIn(test);
    }));

    it("#|", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.bitOr = this.spy(sc.test.func());

      test = instance ["|"] ($that);
      expect(instance.bitOr).to.be.calledWith($that);
      expect(instance.bitOr).to.be.calledLastIn(test);
    }));

    it("#%", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.mod = this.spy(sc.test.func());

      test = instance ["%"] ($that);
      expect(instance.mod).to.be.calledWith($that);
      expect(instance.mod).to.be.calledLastIn(test);
    }));

    it("#**", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.pow = this.spy(sc.test.func());

      test = instance ["**"] ($that);
      expect(instance.pow).to.be.calledWith($that);
      expect(instance.pow).to.be.calledLastIn(test);
    }));

    it("#<<", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.leftShift = this.spy(sc.test.func());

      test = instance ["<<"] ($that);
      expect(instance.leftShift).to.be.calledWith($that);
      expect(instance.leftShift).to.be.calledLastIn(test);
    }));

    it("#>>", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.rightShift = this.spy(sc.test.func());

      test = instance [">>"] ($that);
      expect(instance.rightShift).to.be.calledWith($that);
      expect(instance.rightShift).to.be.calledLastIn(test);
    }));

    it("#+>>", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.unsignedRightShift = this.spy(sc.test.func());

      test = instance ["+>>"] ($that);
      expect(instance.unsignedRightShift).to.be.calledWith($that);
      expect(instance.unsignedRightShift).to.be.calledLastIn(test);
    }));

    it("#<!", sinon.test(function() {
      var instance, test;
      var $that = $$();

      instance = this.createInstance();
      instance.firstArg = this.spy(sc.test.func());

      test = instance ["<!"] ($that);
      expect(instance.firstArg).to.be.calledWith($that);
      expect(instance.firstArg).to.be.calledLastIn(test);
    }));

    it("#asInt", sinon.test(function() {
      var instance, test;

      instance = this.createInstance();
      instance.asInteger = this.spy(sc.test.func());

      test = instance.asInt();
      expect(instance.asInteger).to.be.calledLastIn(test);
    }));

    it("#blend", function() {
      testCase(this, [
        [ $$(0), [ 10       ], $.Float(5.0) ],
        [ $$(0), [ 10, 0.25 ], $.Float(2.5) ],
      ]);
    });

    it("#blendAt", function() {
      testCase(this, [
        [ $$([ 1, 2, 3 ]), [ 1.5 ], $.Float(2.5) ],
      ]);
    });

    it("#blendPut", function() {
      testCase(this, [
        {
          source: $$([ 1, 2, 3 ]),
          args: [ $.Float(1.25), 5 ],
          result: [ 1, 3.75, 1.25 ]
        },
      ]);
    });

    it("#fuzzyEqual", function() {
      testCase(this, [
        [ $.Float(2.5), [ $.Float(3.0) ], $.Float(0.5) ],
      ]);
    });

    it("#isUGen", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isUGen();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#numChannels", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.numChannels();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });

    it("#pair", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.pair();
      expect(test).to.be.a("SCArray").that.deep.equals([ instance, null ]);
    });

    it("#pairs", function() {
      testCase(this, [
        {
          source: $$([ 1, 2 ]),
          args: [ [ 10, 20, 30 ] ],
          result: [
            [ 1, 10 ],
            [ 1, 20 ],
            [ 1, 30 ],
            [ 2, 10 ],
            [ 2, 20 ],
            [ 2, 30 ]
          ]
        }
      ]);
    });

    it("#awake", sinon.test(function() {
      var instance, test;
      var $beats = $$();

      instance = this.createInstance();
      this.stub(instance, "next", sc.test.func());

      test = instance.awake($beats);
      expect(instance.next).to.be.calledWith($beats);
      expect(instance.next).to.be.calledLastIn(test);
    }));

    it("#beats_", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.beats_).to.doNothing;
    });

    it("#clock_", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.clock_).to.doNothing;
    });

    it("#performBinaryOpOnSomething", function() {
      var instance, test;
      var $aSelector;

      instance = this.createInstance();

      $aSelector = $$("\\==");
      test = instance.performBinaryOpOnSomething($aSelector);
      expect(test).to.be.a("SCBoolean").that.is.false;

      $aSelector = $$("\\!=");
      test = instance.performBinaryOpOnSomething($aSelector);
      expect(test).to.be.a("SCBoolean").that.is.true;

      $aSelector = $$("\\+");
      expect(function() {
        instance.performBinaryOpOnSomething($aSelector);
      }).to.throw("binary operator '+' failed");
    });

    it("#performBinaryOpOnSimpleNumber", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $thing     = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "performBinaryOpOnSomething", sc.test.func());

      test = instance.performBinaryOpOnSimpleNumber($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledWith($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledLastIn(test);
    }));

    it("#performBinaryOpOnSignal", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $thing     = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "performBinaryOpOnSomething", sc.test.func());

      test = instance.performBinaryOpOnSignal($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledWith($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledLastIn(test);
    }));

    it("#performBinaryOpOnComplex", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $thing     = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "performBinaryOpOnSomething", sc.test.func());

      test = instance.performBinaryOpOnComplex($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledWith($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledLastIn(test);
    }));

    it("#performBinaryOpOnSeqColl", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $thing     = $$();
      var $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "performBinaryOpOnSomething", sc.test.func());

      test = instance.performBinaryOpOnSeqColl($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledWith($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledLastIn(test);
    }));

    it("#performBinaryOpOnUGen", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $thing     = $$();
      var  $adverb    = $$();

      instance = this.createInstance();
      this.stub(instance, "performBinaryOpOnSomething", sc.test.func());

      test = instance.performBinaryOpOnUGen($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledWith($aSelector, $thing, $adverb);
      expect(instance.performBinaryOpOnSomething).to.be.calledLastIn(test);
    }));
    it.skip("#writeDefFile", function() {
    });

    it("#isInputUGen", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isInputUGen();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#isOutputUGen", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isOutputUGen();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#isControlUGen", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isControlUGen();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });

    it("#source", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.source).to.doNothing;
    });

    it("#asUGenInput", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.asUGenInput).to.doNothing;
    });

    it("#asControlInput", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.asControlInput).to.doNothing;
    });

    it("#asAudioRateInput", sinon.test(function() {
      var instance, test;
      var rate;
      var SCK2A$ar = this.spy(sc.test.func());

      instance = this.createInstance();
      instance.rate = function() {
        return $.Symbol(rate);
      };
      this.stub(sc.lang.klass, "get").withArgs("K2A").returns($$({
        ar: SCK2A$ar
      }));

      rate = "audio";
      test = instance.asAudioRateInput();
      expect(test).to.equal(instance);
      expect(SCK2A$ar).to.be.not.called;
      SCK2A$ar.reset();

      rate = "control";
      test = instance.asAudioRateInput();
      expect(SCK2A$ar).to.be.calledWith(instance);
      expect(SCK2A$ar).to.be.calledLastIn(test);
    }));
    it.skip("#slotSize", function() {
    });
    it.skip("#slotAt", function() {
    });
    it.skip("#slotPut", function() {
    });
    it.skip("#slotKey", function() {
    });
    it.skip("#slotIndex", function() {
    });
    it.skip("#slotsDo", function() {
    });
    it.skip("#slotValuesDo", function() {
    });
    it.skip("#getSlots", function() {
    });
    it.skip("#setSlots", function() {
    });
    it.skip("#instVarSize", function() {
    });
    it.skip("#instVarAt", function() {
    });
    it.skip("#instVarPut", function() {
    });
    it.skip("#writeArchive", function() {
    });
    it.skip(".readArchive", function() {
    });
    it.skip("#asArchive", function() {
    });
    it.skip("#initFromArchive", function() {
    });
    it.skip("#archiveAsCompileString", function() {
    });
    it.skip("#archiveAsObject", function() {
    });
    it.skip("#checkCanArchive", function() {
    });
    it.skip("#writeTextArchive", function() {
    });
    it.skip(".readTextArchive", function() {
    });
    it.skip("#asTextArchive", function() {
    });
    it.skip("#getContainedObjects", function() {
    });
    it.skip("#riteBinaryArchive", function() {
    });
    it.skip(".readBinaryArchive", function() {
    });
    it.skip("#asBinaryArchive", function() {
    });
    it.skip("#genNext", function() {
    });
    it.skip("#genCurrent", function() {
    });
    it.skip(".classRedirect", function() {
    });
    it.skip("#help", function() {
    });

    it("#processRest", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.processRest).to.doNothing;
    });
  });
});
