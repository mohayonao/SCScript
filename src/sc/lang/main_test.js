(function() {
  "use strict";

  require("./main");

  var $ = sc.lang.$;
  var main = sc.lang.main;

  describe("sc.lang.main", function() {
    var $process;
    it("run", sinon.test(function() {
      var test, func;

      func = this.spy(sc.test.func());
      test = main.run(func);
      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);
      $process = main.$process;

      func = this.spy(sc.test.func());
      test = main.run(func);
      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);
      expect(main.$process).to.equal($process);
    }));
    it("$.ThisProcess", function() {
      var instance = $.ThisProcess();
      expect(instance).to.be.a("SCMain").that.equals($process);
    });
    it("$.ThisThread", function() {
      var instance = $.ThisThread();
      expect(instance).to.be.a("SCThread").that.equals($process.mainThread());
    });
    it("$.This", function() {
      var instance = $.This();
      expect(instance).to.be.a("SCInterpreter").that.equals($process.interpreter());
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
