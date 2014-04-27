(function() {
  "use strict";

  require("./dollarSC");

  var $SC = sc.lang.$SC;

  describe("sc.lang.$SC", function() {
    it("should execute with arguments when given message is understood", function() {
      var obj = {
        msg: function(a, b) {
          return a + b;
        }
      };
      var spy = sinon.spy(obj, "msg");
      var test = $SC("msg", obj, [ 1, 2 ]);

      expect(spy).to.be.calledWith(1, 2);
      expect(spy).to.be.returned(test);
    });
    it("should throw error when given message is not understood", function() {
      expect(function() {
        $SC("unknown-message", {});
      }).to.throw("[object Object] cannot understand message 'unknown-message'");
    });
  });
})();
