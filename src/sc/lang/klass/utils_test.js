(function() {
  "use strict";

  require("./utils");

  var $ = sc.lang.$;
  var utils = sc.lang.klass.utils;

  describe("sc.lang.klass.utils", function() {
    it("newCopyArgs", function() {
      var instance = utils.newCopyArgs($("Object"), {
        a: $.Integer(100), b: undefined
      });
      expect(instance).to.be.a("SCObject");
      expect(instance._$a).to.be.a("SCInteger").that.equals(100);
      expect(instance._$b).to.be.a("SCNil");
    });
  });
})();
