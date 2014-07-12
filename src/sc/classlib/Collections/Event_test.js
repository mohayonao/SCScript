(function() {
  "use strict";

  require("./Event");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var SCEvent = $("Event");

  describe("SCEvent", function() {
    before(function() {
      this.createInstance = function() {
        return SCEvent.new();
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.deep.equals({});
    });
    it.skip(".default", function() {
    });
    it.skip(".silent", function() {
    });
    it.skip(".addEventType", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#delta", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#isRest", function() {
    });
    it.skip("#isPlaying_", function() {
    });
    it.skip("#isRunning_", function() {
    });
    it.skip("#playAndDelta", function() {
    });
    it.skip("#synchWithQuant", function() {
    });
    it.skip("#asControlInput", function() {
    });
    it.skip("#asUGenInput", function() {
    });
    it.skip("#printOn", function() {
    });
    it.skip("#storeOn", function() {
    });
    it.skip("#$initClass", function() {
    });
    it.skip("#$makeDefaultSynthDef", function() {
    });
    it.skip("#$makeParentEvents", function() {
    });
    it("setter/getter", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.$("a_", [ $$(1) ]);

      expect(test).to.be.a("SCInteger").that.equals(1);

      test = instance.$("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("setter with warning", sinon.test(function() {
      var instance, test;

      this.stub(SCScript, "stderr");

      instance = this.createInstance();
      test = instance.$("add_", [ $$(1) ]);

      expect(test).to.be.a("SCInteger").that.equals(1);
      expect(SCScript.stderr).to.be.called;

      test = instance.at($$("\\add"));
      expect(test).to.be.a("SCInteger").that.equals(1);
    }));
  });
})();
