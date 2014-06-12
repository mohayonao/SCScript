(function() {
  "use strict";

  require("./Boolean");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  describe("SCBoolean", function() {
    var SCBoolean;
    before(function() {
      SCBoolean = $("Boolean");
      this.createInstance = function(value) {
        var instance = $.Boolean(!!value);
        var testMethod = this.test.title.substr(1);
        sc.test.setSingletonMethod(instance, "Boolean", testMethod);
        return instance;
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
      expect(function() {
        SCBoolean.new();
      }).to.throw("should use literal");
    });
    it("#xor", sinon.test(function() {
      var instance, test, spy;

      spy = this.spy(sc.test.func);
      this.stub($, "Boolean", function() {
        return $$({
          not: spy
        });
      });

      instance = this.createInstance();

      test = instance.xor();
      expect(spy).to.be.calledLastIn(test);
    }));
    it("#asBoolean", function() {
      var instance = this.createInstance();
      expect(instance.asBoolean).to.be.nop;
    });
    it("#booleanValue", function() {
      var instance = this.createInstance();
      expect(instance.booleanValue).to.be.nop;
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
      expect(instance.shallowCopy).to.be.nop;
    });
  });

  describe("SCTrue", function() {
    var SCTrue;
    before(function() {
      SCTrue = $("True");
      this.createInstance = function() {
        return $.True();
      };
    });
    it(".new", function() {
      expect(function() {
        SCTrue.new();
      }).to.throw("should use literal");
    });
    it("#if", sinon.test(function() {
      var instance, test;
      var $trueFunc, $falseFunc;

      $trueFunc = $$({
        value: sc.test.func
      });
      $falseFunc = $$({
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
      var $that;

      $that = $$({
        value: sc.test.func
      });

      instance = this.createInstance();

      test = instance ["&&"] ($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#||", function() {
      var instance = this.createInstance();
      expect(instance["||"]).to.be.nop;
    });
    it("#and", function() {
      var instance, test;
      var $that;

      $that = $$({
        value: sc.test.func
      });

      instance = this.createInstance();

      test = instance.and($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#or", function() {
      var instance = this.createInstance();
      expect(instance.or).to.be.nop;
    });
    it("#nand", function() {
      var instance, test;
      var $that;

      $that = $$({
        value: function() {
          return this;
        },
        not: sc.test.func
      });

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
    var SCFalse;
    before(function() {
      SCFalse = $("False");
      this.createInstance = function() {
        return $.False();
      };
    });
    it(".new", function() {
      expect(function() {
        SCFalse.new();
      }).to.throw("should use literal");
    });
    it("#if", sinon.test(function() {
      var instance, test;
      var $trueFunc, $falseFunc;

      $trueFunc = $$({
        value: function() {
          throw new Error("not reached");
        }
      });
      $falseFunc = $$({
        value: sc.test.func
      });

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
      var instance = this.createInstance();
      expect(instance["&&"]).to.be.nop;
    });
    it("#||", function() {
      var instance, test;
      var $that;

      $that = $$({
        value: sc.test.func
      });

      instance = this.createInstance();

      test = instance ["||"] ($that);
      expect($that.value).to.be.calledLastIn(test);
    });
    it("#and", function() {
      var instance = this.createInstance();
      expect(instance.and).to.be.nop;
    });
    it("#or", function() {
      var instance, test;
      var $that;

      $that = $$({
        value: sc.test.func
      });

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
