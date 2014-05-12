(function() {
  "use strict";

  require("./Kernel");

  var $SC = sc.lang.$SC;

  describe("SCKernel", function() {
    it.skip("write later", function() {
    });
  });

  describe("SCInterpreter", function() {
    var SCInterpreter, $interpreter;
    before(function() {
      SCInterpreter = $SC("Interpreter");
      $interpreter = sc.lang.klass.$interpreter;
    });
    it(".new", function() {
      expect(function() {
        SCInterpreter.new();
      }).to.throw("Interpreter.new is illegal.");
    });
    it("#<>a..z / #clearAll", function() {
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
