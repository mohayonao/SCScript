(function() {
  "use strict";

  require("./random");

  var random = sc.libs.random;

  describe("sc.libs.random", function() {
    it("setCurrent / getCurrent", function() {
      var test;

      test = sc.libs.random.getCurrent();
      expect(test).to.instanceOf(random.RandGen);

      sc.libs.random.setCurrent(0);

      test = sc.libs.random.getCurrent();
      expect(test).to.equal(0);

      sc.libs.random.setCurrent(new random.RandGen());
    });
    it("random generator", function() {
      random.setSeed(0);

      _.each([
        0.85755145549774,
        0.07253098487854,
        0.15391707420349,
        0.53926873207092,
        0.37802028656006,
        0.35834920406342,
        0.63415861129761,
        0.82429480552673,
        0.09632408618927,
        0.93640172481537
      ], function(expected, i) {
        expect(random.next()).withMessage("i: #{0}", i)
          .to.closeTo(expected, 1e-6);
      });
    });
  });
})();
