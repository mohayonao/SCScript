(function() {
  "use strict";

  require("./binaryPrecedence");

  var config = sc.config;

  describe("sc.config", function() {
    describe("binaryPrecedence", function() {
      it("default", function() {
        var test = config.get("binaryPrecedence");
        expect(test).to.be.empty;
      });
      it("set true", function() {
        config.set("binaryPrecedence", true);

        var test = config.get("binaryPrecedence");
        expect(test).to.be.not.empty;
      });
      it("set false", function() {
        config.set("binaryPrecedence", false);

        var test = config.get("binaryPrecedence");
        expect(test).to.be.empty;
      });
      it("set object", function() {
        var object = { "+": 10 };
        config.set("binaryPrecedence", object);

        var test = config.get("binaryPrecedence");
        expect(test).to.equal(object);
      });
      it("throw an error if otherwise", function() {
        expect(function() {
          config.set("binaryPrecedence", 100);
        }).to.throw("must be a boolean or an object");
      });
    });
  });
})();
