(function() {
  "use strict";

  require("./main");

  var $ = sc.lang.$;
  var main = sc.lang.main;

  describe("sc.lang.main", function() {
    it("getCurrentEnvir / setCurrentEnvir", function() {
      var current = main.getCurrentEnvir();
      main.setCurrentEnvir(12345);
      expect(main.getCurrentEnvir()).to.equal(12345);
      main.setCurrentEnvir(current);
    });
    it("getCurrentThread / setCurrentThread", function() {
      var current = main.getCurrentThread();
      main.setCurrentThread(12345);
      expect(main.getCurrentThread()).to.equal(12345);
      main.setCurrentThread(current);
    });
    it("run", sinon.test(function() {
      var test, func;

      func = this.spy(sc.test.func());
      test = main.run(func);
      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);

      func = this.spy(sc.test.func());
      test = main.run(func);
      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);
    }));
    it("$.This", function() {
      var instance = $.This();
      expect(instance).to.be.a("SCInterpreter");
    });
    it("$.ThisProcess", function() {
      var instance = $.ThisProcess();
      expect(instance).to.be.a("SCMain");
    });
    it("$.ThisThread", function() {
      var instance = $.ThisThread();
      expect(instance).to.be.a("SCThread");
    });
    it("$.Environment", function() {
      var test;
      test = $.Environment("test", $.Integer(100));
      expect(test).to.be.a("SCInteger").that.equals(100);

      test = $.Environment("test");
      expect(test).to.be.a("SCInteger").that.equals(100);
    });
  });
})();
