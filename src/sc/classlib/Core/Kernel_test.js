(function() {
  "use strict";

  require("./Kernel");

  var $ = sc.lang.$;

  describe("SCKernel", function() {
    var SCClass, SCMeta_Class;
    before(function() {
      SCClass      = $("Class");
      SCMeta_Class = $("Meta_Class");
    });
    it("#class", function() {
      var test;

      test = SCClass.class();
      expect(test).to.equal(SCMeta_Class);

      test = SCMeta_Class.class();
      expect(test).to.equal(SCClass);
    });
    it("#name", function() {
      var test = SCClass.name();
      expect(test).to.be.a("SCString").that.equals("Class");
    });
  });

  describe("SCProcess", function() {
    var SCProcess;
    before(function() {
      SCProcess = $("Process");
    });
    it(".new", function() {
      expect(function() {
        SCProcess.new();
      }).to.not.throw();
    });
  });

  describe("SCInterpreter", function() {
    var SCInterpreter, $interpreter;
    before(function() {
      SCInterpreter = $("Interpreter");
      $interpreter = SCInterpreter.new();
    });
    it("<>a..z / #clearAll", function() {
      var instance;

      instance = $interpreter;

      "abcdefghijklmnopqrstuvwxyz".split("").forEach(function(ch) {
        var test, $value;

        $value = sc.test.object();

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
