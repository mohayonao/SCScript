(function() {
  "use strict";

  require("./extend");

  var extend = sc.libs.extend;

  describe("sc.libs.extend", function() {
    it("extend", function() {
      var P = function() {};
      var C = function() {};
      extend(C, P);

      var instance = new C();
      expect(instance).to.instanceOf(P);
    });
  });
})();
