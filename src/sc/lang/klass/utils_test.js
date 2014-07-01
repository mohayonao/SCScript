(function() {
  "use strict";

  require("./utils");

  var $ = sc.lang.$;
  var utils = sc.lang.klass.utils;

  describe("sc.lang.klass.utils", function() {
    it("toArray", function() {
      var test = (function() {
        return utils.toArray(arguments);
      })(1, 2, 3, 4, 5);
      expect(test).to.eql([ 1, 2, 3, 4, 5 ]);
    });
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
