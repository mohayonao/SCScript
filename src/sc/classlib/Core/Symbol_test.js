(function() {
  "use strict";

  require("./Symbol");

  var testCase = sc.test.testCase;

  var $ = sc.lang.$;

  describe("SCSymbol", function() {
    var SCSymbol;
    before(function() {
      SCSymbol = $("Symbol");
      this.createInstance = function(value) {
        return $.Symbol(value || "sym");
      };
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
      expect(instance.asSymbol).to.be.nop;
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

      $obj = sc.test.object({
        ascii: sc.test.func
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
    it.skip("#asSetter", function() {
    });
    it.skip("#asGetter", function() {
    });
    it.skip("#asSpec", function() {
    });
    it.skip("#asWarp", function() {
    });
    it.skip("#asTuning", function() {
    });
    it.skip("#asScale", function() {
    });
    it.skip("#isSetter", function() {
    });
    it.skip("#isClassName", function() {
    });
    it.skip("#isMetaClassName", function() {
    });
    it.skip("#isPrefix", function() {
    });
    it.skip("#isPrimitiveName", function() {
    });
    it.skip("#isPrimitive", function() {
    });
    it.skip("#isMap", function() {
    });
    it.skip("#isRest", function() {
    });
    it.skip("#envirGet", function() {
    });
    it.skip("#envirPut", function() {
    });
    it.skip("#blend", function() {
    });
    it.skip("#++", function() {
    });
    it.skip("#asBinOpString", function() {
    });
    it("#applyTo", function() {
      var instance, test;
      var $a, $b;

      $a = $.Integer(10);
      $b = $.Integer(20);

      instance = this.createInstance("*");

      test = instance.applyTo($a, $b);
      expect(test).to.be.a("SCInteger").that.equals(200);
    });
    it("#performBinaryOpOnSomething", function() {
      var instance = this.createInstance();
      expect(instance.performBinaryOpOnSomething).to.be.nop;
    });
    it("#neg", function() {
      var instance = this.createInstance();
      expect(instance.neg).to.be.nop;
    });
    it("#bitNot", function() {
      var instance = this.createInstance();
      expect(instance.bitNot).to.be.nop;
    });
    it("#abs", function() {
      var instance = this.createInstance();
      expect(instance.abs).to.be.nop;
    });
    it("#ceil", function() {
      var instance = this.createInstance();
      expect(instance.ceil).to.be.nop;
    });
    it("#floor", function() {
      var instance = this.createInstance();
      expect(instance.floor).to.be.nop;
    });
    it("#frac", function() {
      var instance = this.createInstance();
      expect(instance.frac).to.be.nop;
    });
    it("#sign", function() {
      var instance = this.createInstance();
      expect(instance.sign).to.be.nop;
    });
    it("#sqrt", function() {
      var instance = this.createInstance();
      expect(instance.sqrt).to.be.nop;
    });
    it("#exp", function() {
      var instance = this.createInstance();
      expect(instance.exp).to.be.nop;
    });
    it("#midicps", function() {
      var instance = this.createInstance();
      expect(instance.midicps).to.be.nop;
    });
    it("#cpsmidi", function() {
      var instance = this.createInstance();
      expect(instance.cpsmidi).to.be.nop;
    });
    it("#midiratio", function() {
      var instance = this.createInstance();
      expect(instance.midiratio).to.be.nop;
    });
    it("#ratiomidi", function() {
      var instance = this.createInstance();
      expect(instance.ratiomidi).to.be.nop;
    });
    it("#ratiomidi", function() {
      var instance = this.createInstance();
      expect(instance.ratiomidi).to.be.nop;
    });
    it("#ampdb", function() {
      var instance = this.createInstance();
      expect(instance.ampdb).to.be.nop;
    });
    it("#dbamp", function() {
      var instance = this.createInstance();
      expect(instance.dbamp).to.be.nop;
    });
    it("#octcps", function() {
      var instance = this.createInstance();
      expect(instance.octcps).to.be.nop;
    });
    it("#cpsoct", function() {
      var instance = this.createInstance();
      expect(instance.cpsoct).to.be.nop;
    });
    it("#log", function() {
      var instance = this.createInstance();
      expect(instance.log).to.be.nop;
    });
    it("#log2", function() {
      var instance = this.createInstance();
      expect(instance.log2).to.be.nop;
    });
    it("#log10", function() {
      var instance = this.createInstance();
      expect(instance.log10).to.be.nop;
    });
    it("#sin", function() {
      var instance = this.createInstance();
      expect(instance.sin).to.be.nop;
    });
    it("#cos", function() {
      var instance = this.createInstance();
      expect(instance.cos).to.be.nop;
    });
    it("#tan", function() {
      var instance = this.createInstance();
      expect(instance.tan).to.be.nop;
    });
    it("#asin", function() {
      var instance = this.createInstance();
      expect(instance.asin).to.be.nop;
    });
    it("#acos", function() {
      var instance = this.createInstance();
      expect(instance.acos).to.be.nop;
    });
    it("#atan", function() {
      var instance = this.createInstance();
      expect(instance.atan).to.be.nop;
    });
    it("#sinh", function() {
      var instance = this.createInstance();
      expect(instance.sinh).to.be.nop;
    });
    it("#cosh", function() {
      var instance = this.createInstance();
      expect(instance.cosh).to.be.nop;
    });
    it("#tanh", function() {
      var instance = this.createInstance();
      expect(instance.tanh).to.be.nop;
    });
    it("#rand", function() {
      var instance = this.createInstance();
      expect(instance.rand).to.be.nop;
    });
    it("#rand2", function() {
      var instance = this.createInstance();
      expect(instance.rand2).to.be.nop;
    });
    it("#linrand", function() {
      var instance = this.createInstance();
      expect(instance.linrand).to.be.nop;
    });
    it("#bilinrand", function() {
      var instance = this.createInstance();
      expect(instance.bilinrand).to.be.nop;
    });
    it("#sum3rand", function() {
      var instance = this.createInstance();
      expect(instance.sum3rand).to.be.nop;
    });
    it("#distort", function() {
      var instance = this.createInstance();
      expect(instance.distort).to.be.nop;
    });
    it("#softclip", function() {
      var instance = this.createInstance();
      expect(instance.softclip).to.be.nop;
    });
    it("#coin", function() {
      var instance = this.createInstance();
      expect(instance.coin).to.be.nop;
    });
    it("#even", function() {
      var instance = this.createInstance();
      expect(instance.even).to.be.nop;
    });
    it("#odd", function() {
      var instance = this.createInstance();
      expect(instance.odd).to.be.nop;
    });
    it("#rectWindow", function() {
      var instance = this.createInstance();
      expect(instance.rectWindow).to.be.nop;
    });
    it("#hanWindow", function() {
      var instance = this.createInstance();
      expect(instance.hanWindow).to.be.nop;
    });
    it("#welWindow", function() {
      var instance = this.createInstance();
      expect(instance.welWindow).to.be.nop;
    });
    it("#triWindow", function() {
      var instance = this.createInstance();
      expect(instance.triWindow).to.be.nop;
    });
    it("#scurve", function() {
      var instance = this.createInstance();
      expect(instance.scurve).to.be.nop;
    });
    it("#ramp", function() {
      var instance = this.createInstance();
      expect(instance.ramp).to.be.nop;
    });
    it("#+", function() {
      var instance = this.createInstance();
      expect(instance["+"]).to.be.nop;
    });
    it("#-", function() {
      var instance = this.createInstance();
      expect(instance["-"]).to.be.nop;
    });
    it("#*", function() {
      var instance = this.createInstance();
      expect(instance["*"]).to.be.nop;
    });
    it("#/", function() {
      var instance = this.createInstance();
      expect(instance["/"]).to.be.nop;
    });
    it("#mod", function() {
      var instance = this.createInstance();
      expect(instance.mod).to.be.nop;
    });
    it("#min", function() {
      var instance = this.createInstance();
      expect(instance.min).to.be.nop;
    });
    it("#max", function() {
      var instance = this.createInstance();
      expect(instance.max).to.be.nop;
    });
    it("#bitAnd", function() {
      var instance = this.createInstance();
      expect(instance.bitAnd).to.be.nop;
    });
    it("#bitOr", function() {
      var instance = this.createInstance();
      expect(instance.bitOr).to.be.nop;
    });
    it("#bitXor", function() {
      var instance = this.createInstance();
      expect(instance.bitXor).to.be.nop;
    });
    it("#bitHammingDistance", function() {
      var instance = this.createInstance();
      expect(instance.bitHammingDistance).to.be.nop;
    });
    it.skip("#hammingDistance", function() {
    });
    it("#lcm", function() {
      var instance = this.createInstance();
      expect(instance.lcm).to.be.nop;
    });
    it("#gcd", function() {
      var instance = this.createInstance();
      expect(instance.gcd).to.be.nop;
    });
    it("#round", function() {
      var instance = this.createInstance();
      expect(instance.round).to.be.nop;
    });
    it("#roundUp", function() {
      var instance = this.createInstance();
      expect(instance.roundUp).to.be.nop;
    });
    it("#trunc", function() {
      var instance = this.createInstance();
      expect(instance.trunc).to.be.nop;
    });
    it("#atan2", function() {
      var instance = this.createInstance();
      expect(instance.atan2).to.be.nop;
    });
    it("#hypot", function() {
      var instance = this.createInstance();
      expect(instance.hypot).to.be.nop;
    });
    it("#hypotApx", function() {
      var instance = this.createInstance();
      expect(instance.hypotApx).to.be.nop;
    });
    it("#pow", function() {
      var instance = this.createInstance();
      expect(instance.pow).to.be.nop;
    });
    it("#leftShift", function() {
      var instance = this.createInstance();
      expect(instance.leftShift).to.be.nop;
    });
    it("#rightShift", function() {
      var instance = this.createInstance();
      expect(instance.rightShift).to.be.nop;
    });
    it("#unsignedRightShift", function() {
      var instance = this.createInstance();
      expect(instance.unsignedRightShift).to.be.nop;
    });
    it("#rrand", function() {
      var instance = this.createInstance();
      expect(instance.rrand).to.be.nop;
    });
    it("#exprand", function() {
      var instance = this.createInstance();
      expect(instance.exprand).to.be.nop;
    });
    it.skip("#<", function() {
    });
    it.skip("#>", function() {
    });
    it.skip("#<=", function() {
    });
    it.skip("#>=", function() {
    });
    it("#degreeToKey", function() {
      var instance = this.createInstance();
      expect(instance.degreeToKey).to.be.nop;
    });
    it("#degrad", function() {
      var instance = this.createInstance();
      expect(instance.degrad).to.be.nop;
    });
    it("#raddeg", function() {
      var instance = this.createInstance();
      expect(instance.raddeg).to.be.nop;
    });
    it("#doNumberOp", function() {
      var instance = this.createInstance();
      expect(instance.doNumberOp).to.be.nop;
    });
    it("#doComplexOp", function() {
      var instance = this.createInstance();
      expect(instance.doComplexOp).to.be.nop;
    });
    it("#doSignalOp", function() {
      var instance = this.createInstance();
      expect(instance.doSignalOp).to.be.nop;
    });
    it.skip("#doListOp", function() {
    });
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
      expect(instance.shallowCopy).to.be.nop;
    });
    it("#performBinaryOpOnSimpleNumber", function() {
      var instance = this.createInstance();
      expect(instance.performBinaryOpOnSimpleNumber).to.be.nop;
    });
  });
})();
