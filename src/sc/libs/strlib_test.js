(function() {
  "use strict";

  require("./strlib");

  var strlib = sc.libs.strlib;

  describe("sc.libs.strlib", function() {
    it("article", function() {
      expect(strlib.article("apple")).to.equal("an");
      expect(strlib.article("banana")).to.equal("a");
    });
    it("format args", function() {
      var str = strlib.format(
        "At #{0} in #{1}, the temperature was #{2} degrees.",
        "today", "Chicago", -16
      );
      expect(str).to.equal("At today in Chicago, the temperature was -16 degrees.");
    });
    it("format list", function() {
      var str = strlib.format(
        "At @{0} in @{1}, the temperature was @{2} degrees.",
        [ "today", "Chicago", -16 ]
      );
      expect(str).to.equal("At today in Chicago, the temperature was -16 degrees.");
    });
  });
})();
