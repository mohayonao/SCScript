(function() {
  "use strict";

  require("./Symbol");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var SCSymbol = $("Symbol");

  describe("SCSymbol", function() {
    before(function() {
      this.createInstance = function(value) {
        return $.Symbol(value || "sym");
      };
    });
    it("#__tag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__tag;
      expect(test).to.be.a("JSNumber").that.equals(sc.TAG_SYM);
    });
    it("#__sym__", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__sym__();
      expect(test).to.be.a("JSString").that.equals("sym");
    });
    it("#__str__", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.__str__();
      expect(test).to.be.a("JSString").that.equals("sym");
    });
    it(".new", function() {
      expect(function() {
        SCSymbol.new();
      }).to.throw("should use literal");
    });
    it("#asSymbol", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.asSymbol).to.doNothing;
    });
    it("#asInteger", function() {
      testCase(this, [
        [ "100", [], 100 ],
        [ "+50", [], +50 ],
        [ "-50", [], -50 ],
        [ "5.5", [],   5 ],
        [ "5oo", [],   5 ],
        [ "oo5", [],   0 ],
      ]);
    });
    it("#asFloat", function() {
      testCase(this, [
        [ "100", [], $.Float(100) ],
        [ "+50", [], $.Float(+50) ],
        [ "-50", [], $.Float(-50) ],
        [ "5.5", [], $.Float(5.5) ],
        [ "5oo", [], $.Float(  5) ],
        [ "oo5", [], $.Float(  0) ],
        [ "+1.5e-5", [], +1.5e-5 ],
      ]);
    });
    it("#ascii", sinon.test(function() {
      var instance, test;
      var SCString$ascii = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(instance, "asString").returns($$({ ascii: SCString$ascii }));

      test = instance.ascii();
      expect(instance.asString).to.be.called;
      expect(SCString$ascii).to.be.calledLastIn(test);
    }));
    it.skip("#asCompileString", function() {
    });
    it("#asClass", function() {
      var instance, test;

      instance = this.createInstance("Symbol");
      test = instance.asClass();
      expect(test).to.equal(SCSymbol);

      instance = this.createInstance("Not-Defined-Class");
      test = instance.asClass();
      expect(test).to.be.a("SCNil").that.is.null;
    });
    it("#asSetter", function() {
      testCase(this, [
        [ "a" , [], "\\a_" ],
        [ "a_", [], "\\a_" ],
        {
          source: "Symbol",
          error: "Cannot convert"
        },
        {
          source: "_",
          error: "Cannot convert"
        }
      ]);
    });
    it("#asGetter", function() {
      testCase(this, [
        [ "a" , [], "\\a" ],
        [ "a_", [], "\\a" ],
      ]);
    });
    it("#asSpec", sinon.test(function() {
      var instance, test;
      var SCArray$at = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Spec").returns($$({
        specs: function() {
          return $$({ at: SCArray$at });
        }
      }));

      test = instance.asSpec();
      expect(SCArray$at).to.be.calledWith(instance);
      expect(SCArray$at).to.be.calledLastIn(test);
    }));
    it("#asWarp", sinon.test(function() {
      var instance, test;
      var $spec = $$();
      var SCArray$at = this.spy(function() {
        return $$({ new: SCObject$new  });
      });
      var SCObject$new = this.spy(sc.test.func());

      this.stub(sc.lang.klass, "get").withArgs("Warp").returns($$({
        warps: function() {
          return $$({ at: SCArray$at });
        }
      }));
      instance = this.createInstance();

      test = instance.asWarp($spec);
      expect(SCArray$at).to.be.calledWith(instance);
      expect(SCObject$new).to.be.calledWith($spec);
      expect(SCObject$new).to.be.calledLastIn(test);
    }));
    it("#asTuning", sinon.test(function() {
      var instance, test;
      var SCTuning$at = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Tuning").returns($$({
        at: SCTuning$at
      }));

      test = instance.asTuning();
      expect(SCTuning$at).to.be.calledWith(instance);
      expect(SCTuning$at).to.be.calledLastIn(test);
    }));
    it("#asScale", sinon.test(function() {
      var instance, test;
      var SCScale$at = this.spy(sc.test.func());

      instance = this.createInstance();
      this.stub(sc.lang.klass, "get").withArgs("Scale").returns($$({
        at: SCScale$at
      }));

      test = instance.asScale();
      expect(SCScale$at).to.be.calledWith(instance);
      expect(SCScale$at).to.be.calledLastIn(test);
    }));
    it("#isSetter", function() {
      testCase(this, [
        [ "a_", [], true  ],
        [ "a" , [], false ],
        [ "A_", [], false ],
        [ "1_", [], false ],
      ]);
    });
    it("#isClassName", function() {
      testCase(this, [
        [ "Symbol" , [], true ],
        [ "Symbol_", [], true ],
        [ "lowercase", [], false ],
      ]);
    });
    it("#isMetaClassName", function() {
      testCase(this, [
        [ "Meta_Symbol", [], true  ],
        [ "Symbol"     , [], false ],
      ]);
    });
    it("#isPrefix", function() {
      testCase(this, [
        [ "isPrefix", [ "\\is"  ], true  ],
        [ "isPrefix", [ "\\isa" ], false ],
        [ "isPrefix", [ 0 ], "\\isPrefix" ]
      ]);
    });
    it("#isPrimitiveName", function() {
      testCase(this, [
        [ "_Primitive", [], true  ],
        [ "Primitive_", [], false ],
      ]);
    });
    it("#isPrimitive", function() {
      testCase(this, [
        [ "_SymbolIsClassName", [], false ]
      ]);
    });
    it("#isMap", function() {
      testCase(this, [
        [ "a0", [], true ]
      ]);
    });
    it("#isRest", function() {
      testCase(this, [
        [ "a0", [], false ]
      ]);
    });
    it("#envirGet", sc.test(function() {
      var instance, test;

      $.Environment("key", $$(1234));
      instance = this.createInstance("key");

      test = instance.envirGet();
      expect(test).to.be.a("SCInteger").that.equals(1234);
    }));
    it("#envirPut", sc.test(function() {
      var instance, test;

      instance = this.createInstance("key");
      test = instance.envirPut($$(5678));
      expect(test).to.be.a("SCInteger").that.equals(5678);

      test = $.Environment("key");
      expect(test).to.be.a("SCInteger").that.equals(5678);
    }));
    it("#blend", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.blend).to.doNothing;
    });
    it("#++", function() {
      testCase(this, [
        [ "abc", [ "def" ], "abcdef" ]
      ]);
    });
    it("#asBinOpString", function() {
      testCase(this, [
        [ "max", [], "max:" ],
        [ "123", [], "\\123" ],
      ]);
    });
    it("#applyTo", function() {
      var instance, test;
      var $a = $$(10);
      var $b = $$(20);

      instance = this.createInstance("*");

      test = instance.applyTo($a, $b);
      expect(test).to.be.a("SCInteger").that.equals(200);
    });
    it("#performBinaryOpOnSomething", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.performBinaryOpOnSomething).to.doNothing;
    });

    _.each([
      "#neg",
      "#bitNot",
      "#abs",
      "#ceil",
      "#floor",
      "#frac",
      "#sign",
      "#sqrt",
      "#exp",
      "#midicps",
      "#cpsmidi",
      "#midiratio",
      "#ratiomidi",
      "#ratiomidi",
      "#ampdb",
      "#dbamp",
      "#octcps",
      "#cpsoct",
      "#log",
      "#log2",
      "#log10",
      "#sin",
      "#cos",
      "#tan",
      "#asin",
      "#acos",
      "#atan",
      "#sinh",
      "#cosh",
      "#tanh",
      "#rand",
      "#rand2",
      "#linrand",
      "#bilinrand",
      "#sum3rand",
      "#distort",
      "#softclip",
      "#coin",
      "#even",
      "#odd",
      "#rectWindow",
      "#hanWindow",
      "#welWindow",
      "#triWindow",
      "#scurve",
      "#ramp",
      "#+",
      "#-",
      "#*",
      "#/",
      "#mod",
      "#min",
      "#max",
      "#bitAnd",
      "#bitOr",
      "#bitXor",
      "#bitHammingDistance",
      "#lcm",
      "#gcd",
      "#round",
      "#roundUp",
      "#trunc",
      "#atan2",
      "#hypot",
      "#hypotApx",
      "#pow",
      "#leftShift",
      "#rightShift",
      "#unsignedRightShift",
      "#rrand",
      "#exprand"
    ], function(methodName) {
      it(methodName, function() {
        var instance;

        instance = this.createInstance();
        expect(instance.neg).to.doNothing;
      });
    });

    it.skip("#hammingDistance", function() {
    });
    it("#<", function() {
      testCase(this, [
        [ "b", [ "\\a" ], false ],
        [ "b", [ "\\b" ], false ],
        [ "b", [ "\\c" ], true  ],
      ]);
    });
    it("#>", function() {
      testCase(this, [
        [ "b", [ "\\a" ], true  ],
        [ "b", [ "\\b" ], false ],
        [ "b", [ "\\c" ], false ],
      ]);
    });
    it("#<=", function() {
      testCase(this, [
        [ "b", [ "\\a" ], false ],
        [ "b", [ "\\b" ], true  ],
        [ "b", [ "\\c" ], true  ],
      ]);
    });
    it("#>=", function() {
      testCase(this, [
        [ "b", [ "\\a" ], true  ],
        [ "b", [ "\\b" ], true  ],
        [ "b", [ "\\c" ], false ],
      ]);
    });
    it("#degreeToKey", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.degreeToKey).to.doNothing;
    });
    it("#degrad", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.degrad).to.doNothing;
    });
    it("#raddeg", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.raddeg).to.doNothing;
    });
    it("#doNumberOp", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.doNumberOp).to.doNothing;
    });
    it("#doComplexOp", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.doComplexOp).to.doNothing;
    });
    it("#doSignalOp", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.doSignalOp).to.doNothing;
    });
    it("#doListOp", sinon.test(function() {
      var instance, test;
      var $aSelector = $$();
      var $item1 = $$({ perform: this.spy() });
      var $item2 = $$({ perform: this.spy() });

      instance = this.createInstance();

      test = instance.doListOp($aSelector, $$([ $item1, $item2 ]));
      expect(test).to.equal(instance);
    }));
    it.skip("#primitiveIndex", function() {
    });
    it.skip("#specialIndex", function() {
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#codegen_UGenCtorArg", function() {
    });
    it("#archiveAsCompileString", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.archiveAsCompileString();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it.skip("#kr", function() {
    });
    it.skip("#ir", function() {
    });
    it.skip("#tr", function() {
    });
    it.skip("#ar", function() {
    });
    it.skip("#matchOSCAddressPattern", function() {
    });
    it.skip("#help", function() {
    });
    it("#asString", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asString();
      expect(test).to.be.a("SCString").that.equals("sym");
    });
    it("#shallowCopy", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.shallowCopy).to.doNothing;
    });
    it("#performBinaryOpOnSimpleNumber", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.performBinaryOpOnSimpleNumber).to.doNothing;
    });
  });
})();
