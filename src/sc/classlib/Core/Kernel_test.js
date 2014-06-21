(function() {
  "use strict";

  require("./Kernel");
  require("../Collections/Set");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  var SCClass = $("Class");
  var SCMetaClass = $("Meta_Class");
  var SCProcess = $("Process");
  var SCMain = $("Main");
  var SCInterpreter = $("Interpreter");

  describe("SCClass", function() {
    it("#class", function() {
      var test;

      test = SCClass.class();
      expect(test).to.equal(SCMetaClass);

      test = SCMetaClass.class();
      expect(test).to.equal(SCClass);
    });
    it("#name", function() {
      var test = SCClass.name();
      expect(test).to.be.a("SCString").that.equals("Class");
    });
    it("#[]", function() {
      var test;
      test = $("Set")["[]"]($$([ 1, 2, 3, 4 ]));
      expect(test).to.be.a("SCSet").that.eqls([ 1, 2, 3, 4 ]);
    });
  });

  describe("SCProcess", function() {
    before(function() {
      this.createInstance = function() {
        return SCProcess.new();
      };
    });
    it("<interpreter", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.interpreter();

      expect(test).to.be.a("SCNil");
    });
    it("<mainThread", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.mainThread();

      expect(test).to.be.a("SCNil");
    });
  });

  describe("SCMain", function() {
    it(".new", function() {
      expect(function() {
        SCMain.new();
      }).to.not.throw();
    });
  });

  describe("SCInterpreter", function() {
    before(function() {
      this.createInstance = function() {
        return SCInterpreter.new();
      };
    });
    it("<>a..z / #clearAll", function() {
      var instance;

      instance = this.createInstance();

      "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(ch) {
        var test, $value;

        $value = $$();

        test = instance[ch]();
        expect(test).to.be.a("SCNil");

        test = instance[ch + "_"]($value);
        expect(test).to.equal(instance);

        test = instance[ch]();
        expect(test).to.equal($value);
      });

      instance.clearAll();

      "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(ch) {
        var test = instance[ch]();
        expect(test).to.be.a("SCNil");
      });
    });
  });
})();
