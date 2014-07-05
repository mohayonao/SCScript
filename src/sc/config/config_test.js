(function() {
  "use strict";

  require("./config");

  var config = sc.config;

  describe("sc.config", function() {
    before(function() {
      config.add("test-config-1", "test", function(value) {
        return "**" + value + "**";
      });
      config.add("test-config-2");
    });
    describe("get", function() {
      it("work", function() {
        var test = sc.config.get("test-config-1");
        expect(test).to.equal("test");
      });
      it("work", function() {
        var test = sc.config.get("test-config-2");
        expect(test).to.be.null;
      });
      it("throw error if not exists", function() {
        expect(function() {
          sc.config.get("unknown-test-config");
        }).to.throw();
      });
    });
    describe("set", function() {
      it("work", function() {
        sc.config.set("test-config-1", "TEST");

        var test = sc.config.get("test-config-1");
        expect(test).to.equal("**TEST**");
      });
      it("work", function() {
        sc.config.set("test-config-2", "TEST");

        var test = sc.config.get("test-config-2");
        expect(test).to.equal("TEST");
      });
      it("throw error if not exists", function() {
        expect(function() {
          sc.config.set("unknown-test-config", "TEST");
        }).to.throw();
      });
    });
  });
})();
