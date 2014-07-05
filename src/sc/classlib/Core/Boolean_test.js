(function() {
  "use strict";

  require("./Boolean");

  var $$ = sc.test.object;
  var testCase = sc.test.testCase;

  var $ = sc.lang.$;
  var SCBoolean = $("Boolean");
  var SCFalse = $("False");
  var SCTrue = $("True");

  describe("SCBoolean", function() {
    before(function() {
      this.createInstance = function(value) {
        var instance = $.Boolean(!!value);
        return $$(instance, "Boolean" + this.test.title);
      };
    });
    it("#__bool__", function() {
      var instance = this.createInstance();

      expect(function() {
        instance.__bool__();
      }).to.not.throw();
    });
    it("#toString", function() {
      var instance, test;

      instance = this.createInstance(true);
      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("true");

      instance = this.createInstance(false);
      test = instance.toString();
      expect(test).to.be.a("JSString").that.equals("false");
    });
    it(".new", function() {
      expect(SCBoolean.new.__errorType).to.equal(sc.ERRID_SHOULD_USE_LITERALS);
    });
    it("#xor", function() {
      testCase(this, [
        [ true , [ true  ], false ],
        [ true , [ false ], true  ],
        [ false, [ true  ], true  ],
        [ false, [ false ], false ],
      ]);
    });
    it("#asBoolean", function() {
      var instance = this.createInstance();
      expect(instance.asBoolean).to.doNothing;
    });
    it("#booleanValue", function() {
      var instance = this.createInstance();
      expect(instance.booleanValue).to.doNothing;
    });
    it("#archiveAsCompileString", function() {
      var test, instance;

      instance = this.createInstance();

      test = instance.archiveAsCompileString();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#while", function() {
      var instance = this.createInstance();
      expect(function() {
        instance.while();
      }).to.throw();
    });
    it("#shallowCopy", function() {
      var instance = this.createInstance();
      expect(instance.shallowCopy).to.doNothing;
    });
  });

  describe("SCTrue", function() {
    before(function() {
      this.createInstance = function() {
        return $.True();
      };
    });
    it(".new", function() {
      expect(function() {
        SCTrue.new();
      }).to.throw("should use literals");
    });
    it("#if", sinon.test(function() {
      var instance, test;
      var $trueFunc = $$({ value: sc.test.func() });
      var $falseFunc = $$({
        value: function() {
          throw new Error("not reached");
        }
      });

      instance = this.createInstance();

      test = instance.if($trueFunc, $falseFunc);
      expect($trueFunc.value).to.be.calledLastIn(test);
    }));
    it("#not", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.not();
      expect(test).to.be.a("SCBoolean").that.is.false;
    });
    it("#&&", function() {
      var instance, test;
      var $that = $$({ value: sc.test.func() });

      instance = this.createInstance();

      test = instance ["&&"] ($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#||", function() {
      var instance = this.createInstance();
      expect(instance["||"]).to.doNothing;
    });
    it("#and", function() {
      var instance, test;
      var $that = $$({ value: sc.test.func() });

      instance = this.createInstance();

      test = instance.and($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#or", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.or).to.doNothing;
    });
    it("#nand", function() {
      var instance, test;
      var $that = $$({ value: function() {
        return this;
      }, not: sc.test.func() });

      instance = this.createInstance();

      test = instance.nand($that);
      expect($that.not).to.be.calledLastIn(test);
    });
    it("#asInteger", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asInteger();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("#binaryValue", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.binaryValue();
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
  });

  describe("SCFalse", function() {
    before(function() {
      this.createInstance = function() {
        return $.False();
      };
    });
    it(".new", function() {
      expect(function() {
        SCFalse.new();
      }).to.throw("should use literals");
    });
    it("#if", sinon.test(function() {
      var instance, test;
      var $trueFunc = $$({
        value: function() {
          throw new Error("not reached");
        }
      });
      var $falseFunc = $$({ value: sc.test.func() });

      instance = this.createInstance();

      test = instance.if($trueFunc, $falseFunc);
      expect($falseFunc.value).to.be.calledLastIn(test);
    }));
    it("#not", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.not();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#&&", function() {
      var instance;

      instance = this.createInstance();
      expect(instance["&&"]).to.doNothing;
    });
    it("#||", function() {
      var instance, test;
      var $that = $$({ value: sc.test.func() });

      instance = this.createInstance();

      test = instance ["||"] ($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#and", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.and).to.doNothing;
    });
    it("#or", function() {
      var instance, test;
      var $that = $$({ value: sc.test.func() });

      instance = this.createInstance();

      test = instance.or($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#nand", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.nand();
      expect(test).to.be.a("SCBoolean").that.is.true;
    });
    it("#asInteger", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.asInteger();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
    it("#binaryValue", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.binaryValue();
      expect(test).to.be.a("SCInteger").that.equals(0);
    });
  });
})();
