describe("sc.lang.main", function() {
  "use strict";

  var $  = sc.lang.$;
  var $$ = sc.test.object;

  describe("currentEnvir", function() {
    var current;

    before(function() {
      current = sc.lang.main.getCurrentEnvir();
    });
    after(function() {
      sc.lang.main.setCurrentEnvir(current);
    });

    it("set / get", function() {
      sc.lang.main.setCurrentEnvir(12345);

      var test = sc.lang.main.getCurrentEnvir();

      expect(test).to.equal(12345);
    });
  });

  describe("currentThread", function() {
    var current;

    before(function() {
      current = sc.lang.main.getCurrentThread();
    });
    after(function() {
      sc.lang.main.setCurrentThread(current);
    });

    it("set / get", function() {
      sc.lang.main.setCurrentThread(12345);

      var test = sc.lang.main.getCurrentThread();

      expect(test).to.equal(12345);
    });
  });

  describe("run", function() {
    it("1", sinon.test(function() {
      var func = this.spy(sc.test.func());
      var test = sc.lang.main.run(func);

      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);
    }));

    it("2", sinon.test(function() {
      var func = this.spy(sc.test.func());
      var test = sc.lang.main.run(func);

      expect(func).to.be.calledWith($);
      expect(func).to.be.calledLastIn(test);
    }));
  });

  describe("$", function() {
    it("This", function() {
      var instance = $.This();

      expect(instance).to.be.a("SCInterpreter");
    });

    it("ThisProcess", function() {
      var instance = $.ThisProcess();

      expect(instance).to.be.a("SCMain");
    });

    it("ThisThread", function() {
      var instance = $.ThisThread();

      expect(instance).to.be.a("SCThread");
    });

    it("Environment", function() {
      var test;

      test = $.Environment("test", $$(100));
      expect(test).to.be.a("SCInteger").that.equals(100);

      test = $.Environment("test");
      expect(test).to.be.a("SCInteger").that.equals(100);
    });
  });

});
