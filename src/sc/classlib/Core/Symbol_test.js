(function() {
  "use strict";

  require("./Symbol");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $     = sc.lang.$;
  var klass = sc.lang.klass;

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
      var instance = this.createInstance();
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
      var $obj;

      $obj = $$({
        ascii: sc.test.func()
      });

      instance = this.createInstance();
      this.stub(instance, "asString", function() {
        return $obj;
      });

      test = instance.ascii();
      expect(instance.asString).to.be.called;
      expect($obj.ascii).to.be.calledLastIn(test);
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
      var $at;

      $at = this.spy(sc.test.func());
      this.stub(klass, "get").withArgs("Spec").returns(sc.test.object({
        specs: function() {
          return sc.test.object({ at: $at });
        }
      }));
      instance = this.createInstance();

      test = instance.asSpec();
      expect($at).to.be.calledWith(instance);
      expect($at).to.be.calledLastIn(test);
    }));
    it("#asWarp", sinon.test(function() {
      var instance, test;
      var $spec, $at, $new;

      $spec = $$();
      this.stub(klass, "get").withArgs("Warp").returns(sc.test.object({
        warps: function() {
          return sc.test.object({
            at: $at
          });
        }
      }));
      $at = this.spy(function() {
        return sc.test.object({
          new: $new
        });
      });
      $new = this.spy(sc.test.func());
      instance = this.createInstance();

      test = instance.asWarp($spec);
      expect($at).to.be.calledWith(instance);
      expect($new).to.be.calledWith($spec);
      expect($new).to.be.calledLastIn(test);
    }));
    it("#asTuning", sinon.test(function() {
      var instance, test;
      var $at;

      this.stub(klass, "get").withArgs("Tuning").returns(sc.test.object({
        at: ($at = this.spy(sc.test.func()))
      }));
      instance = this.createInstance();

      test = instance.asTuning();
      expect($at).to.be.calledWith(instance);
      expect($at).to.be.calledLastIn(test);
    }));
    it("#asScale", sinon.test(function() {
      var instance, test;
      var $at;

      this.stub(klass, "get").withArgs("Scale").returns(sc.test.object({
        at: ($at = this.spy(sc.test.func()))
      }));
      instance = this.createInstance();

      test = instance.asScale();
      expect($at).to.be.calledWith(instance);
      expect($at).to.be.calledLastIn(test);
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
      var instance = this.createInstance();
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
      var $a, $b;

      $a = $$(10);
      $b = $$(20);

      instance = this.createInstance("*");

      test = instance.applyTo($a, $b);
      expect(test).to.be.a("SCInteger").that.equals(200);
    });
    it("#performBinaryOpOnSomething", function() {
      var instance = this.createInstance();
      expect(instance.performBinaryOpOnSomething).to.doNothing;
    });
    it("#neg", function() {
      var instance = this.createInstance();
      expect(instance.neg).to.doNothing;
    });
    it("#bitNot", function() {
      var instance = this.createInstance();
      expect(instance.bitNot).to.doNothing;
    });
    it("#abs", function() {
      var instance = this.createInstance();
      expect(instance.abs).to.doNothing;
    });
    it("#ceil", function() {
      var instance = this.createInstance();
      expect(instance.ceil).to.doNothing;
    });
    it("#floor", function() {
      var instance = this.createInstance();
      expect(instance.floor).to.doNothing;
    });
    it("#frac", function() {
      var instance = this.createInstance();
      expect(instance.frac).to.doNothing;
    });
    it("#sign", function() {
      var instance = this.createInstance();
      expect(instance.sign).to.doNothing;
    });
    it("#sqrt", function() {
      var instance = this.createInstance();
      expect(instance.sqrt).to.doNothing;
    });
    it("#exp", function() {
      var instance = this.createInstance();
      expect(instance.exp).to.doNothing;
    });
    it("#midicps", function() {
      var instance = this.createInstance();
      expect(instance.midicps).to.doNothing;
    });
    it("#cpsmidi", function() {
      var instance = this.createInstance();
      expect(instance.cpsmidi).to.doNothing;
    });
    it("#midiratio", function() {
      var instance = this.createInstance();
      expect(instance.midiratio).to.doNothing;
    });
    it("#ratiomidi", function() {
      var instance = this.createInstance();
      expect(instance.ratiomidi).to.doNothing;
    });
    it("#ratiomidi", function() {
      var instance = this.createInstance();
      expect(instance.ratiomidi).to.doNothing;
    });
    it("#ampdb", function() {
      var instance = this.createInstance();
      expect(instance.ampdb).to.doNothing;
    });
    it("#dbamp", function() {
      var instance = this.createInstance();
      expect(instance.dbamp).to.doNothing;
    });
    it("#octcps", function() {
      var instance = this.createInstance();
      expect(instance.octcps).to.doNothing;
    });
    it("#cpsoct", function() {
      var instance = this.createInstance();
      expect(instance.cpsoct).to.doNothing;
    });
    it("#log", function() {
      var instance = this.createInstance();
      expect(instance.log).to.doNothing;
    });
    it("#log2", function() {
      var instance = this.createInstance();
      expect(instance.log2).to.doNothing;
    });
    it("#log10", function() {
      var instance = this.createInstance();
      expect(instance.log10).to.doNothing;
    });
    it("#sin", function() {
      var instance = this.createInstance();
      expect(instance.sin).to.doNothing;
    });
    it("#cos", function() {
      var instance = this.createInstance();
      expect(instance.cos).to.doNothing;
    });
    it("#tan", function() {
      var instance = this.createInstance();
      expect(instance.tan).to.doNothing;
    });
    it("#asin", function() {
      var instance = this.createInstance();
      expect(instance.asin).to.doNothing;
    });
    it("#acos", function() {
      var instance = this.createInstance();
      expect(instance.acos).to.doNothing;
    });
    it("#atan", function() {
      var instance = this.createInstance();
      expect(instance.atan).to.doNothing;
    });
    it("#sinh", function() {
      var instance = this.createInstance();
      expect(instance.sinh).to.doNothing;
    });
    it("#cosh", function() {
      var instance = this.createInstance();
      expect(instance.cosh).to.doNothing;
    });
    it("#tanh", function() {
      var instance = this.createInstance();
      expect(instance.tanh).to.doNothing;
    });
    it("#rand", function() {
      var instance = this.createInstance();
      expect(instance.rand).to.doNothing;
    });
    it("#rand2", function() {
      var instance = this.createInstance();
      expect(instance.rand2).to.doNothing;
    });
    it("#linrand", function() {
      var instance = this.createInstance();
      expect(instance.linrand).to.doNothing;
    });
    it("#bilinrand", function() {
      var instance = this.createInstance();
      expect(instance.bilinrand).to.doNothing;
    });
    it("#sum3rand", function() {
      var instance = this.createInstance();
      expect(instance.sum3rand).to.doNothing;
    });
    it("#distort", function() {
      var instance = this.createInstance();
      expect(instance.distort).to.doNothing;
    });
    it("#softclip", function() {
      var instance = this.createInstance();
      expect(instance.softclip).to.doNothing;
    });
    it("#coin", function() {
      var instance = this.createInstance();
      expect(instance.coin).to.doNothing;
    });
    it("#even", function() {
      var instance = this.createInstance();
      expect(instance.even).to.doNothing;
    });
    it("#odd", function() {
      var instance = this.createInstance();
      expect(instance.odd).to.doNothing;
    });
    it("#rectWindow", function() {
      var instance = this.createInstance();
      expect(instance.rectWindow).to.doNothing;
    });
    it("#hanWindow", function() {
      var instance = this.createInstance();
      expect(instance.hanWindow).to.doNothing;
    });
    it("#welWindow", function() {
      var instance = this.createInstance();
      expect(instance.welWindow).to.doNothing;
    });
    it("#triWindow", function() {
      var instance = this.createInstance();
      expect(instance.triWindow).to.doNothing;
    });
    it("#scurve", function() {
      var instance = this.createInstance();
      expect(instance.scurve).to.doNothing;
    });
    it("#ramp", function() {
      var instance = this.createInstance();
      expect(instance.ramp).to.doNothing;
    });
    it("#+", function() {
      var instance = this.createInstance();
      expect(instance["+"]).to.doNothing;
    });
    it("#-", function() {
      var instance = this.createInstance();
      expect(instance["-"]).to.doNothing;
    });
    it("#*", function() {
      var instance = this.createInstance();
      expect(instance["*"]).to.doNothing;
    });
    it("#/", function() {
      var instance = this.createInstance();
      expect(instance["/"]).to.doNothing;
    });
    it("#mod", function() {
      var instance = this.createInstance();
      expect(instance.mod).to.doNothing;
    });
    it("#min", function() {
      var instance = this.createInstance();
      expect(instance.min).to.doNothing;
    });
    it("#max", function() {
      var instance = this.createInstance();
      expect(instance.max).to.doNothing;
    });
    it("#bitAnd", function() {
      var instance = this.createInstance();
      expect(instance.bitAnd).to.doNothing;
    });
    it("#bitOr", function() {
      var instance = this.createInstance();
      expect(instance.bitOr).to.doNothing;
    });
    it("#bitXor", function() {
      var instance = this.createInstance();
      expect(instance.bitXor).to.doNothing;
    });
    it("#bitHammingDistance", function() {
      var instance = this.createInstance();
      expect(instance.bitHammingDistance).to.doNothing;
    });
    it.skip("#hammingDistance", function() {
    });
    it("#lcm", function() {
      var instance = this.createInstance();
      expect(instance.lcm).to.doNothing;
    });
    it("#gcd", function() {
      var instance = this.createInstance();
      expect(instance.gcd).to.doNothing;
    });
    it("#round", function() {
      var instance = this.createInstance();
      expect(instance.round).to.doNothing;
    });
    it("#roundUp", function() {
      var instance = this.createInstance();
      expect(instance.roundUp).to.doNothing;
    });
    it("#trunc", function() {
      var instance = this.createInstance();
      expect(instance.trunc).to.doNothing;
    });
    it("#atan2", function() {
      var instance = this.createInstance();
      expect(instance.atan2).to.doNothing;
    });
    it("#hypot", function() {
      var instance = this.createInstance();
      expect(instance.hypot).to.doNothing;
    });
    it("#hypotApx", function() {
      var instance = this.createInstance();
      expect(instance.hypotApx).to.doNothing;
    });
    it("#pow", function() {
      var instance = this.createInstance();
      expect(instance.pow).to.doNothing;
    });
    it("#leftShift", function() {
      var instance = this.createInstance();
      expect(instance.leftShift).to.doNothing;
    });
    it("#rightShift", function() {
      var instance = this.createInstance();
      expect(instance.rightShift).to.doNothing;
    });
    it("#unsignedRightShift", function() {
      var instance = this.createInstance();
      expect(instance.unsignedRightShift).to.doNothing;
    });
    it("#rrand", function() {
      var instance = this.createInstance();
      expect(instance.rrand).to.doNothing;
    });
    it("#exprand", function() {
      var instance = this.createInstance();
      expect(instance.exprand).to.doNothing;
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
      var instance = this.createInstance();
      expect(instance.degreeToKey).to.doNothing;
    });
    it("#degrad", function() {
      var instance = this.createInstance();
      expect(instance.degrad).to.doNothing;
    });
    it("#raddeg", function() {
      var instance = this.createInstance();
      expect(instance.raddeg).to.doNothing;
    });
    it("#doNumberOp", function() {
      var instance = this.createInstance();
      expect(instance.doNumberOp).to.doNothing;
    });
    it("#doComplexOp", function() {
      var instance = this.createInstance();
      expect(instance.doComplexOp).to.doNothing;
    });
    it("#doSignalOp", function() {
      var instance = this.createInstance();
      expect(instance.doSignalOp).to.doNothing;
    });
    it("#doListOp", sinon.test(function() {
      var instance, test;
      var $aSelector, $item1, $item2;

      $aSelector = $$();
      $item1 = $$({ perform: this.spy() });
      $item2 = $$({ perform: this.spy() });
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
      var instance = this.createInstance();
      expect(instance.shallowCopy).to.doNothing;
    });
    it("#performBinaryOpOnSimpleNumber", function() {
      var instance = this.createInstance();
      expect(instance.performBinaryOpOnSimpleNumber).to.doNothing;
    });
  });
})();
