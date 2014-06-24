(function() {
  "use strict";

  require("./strlib");

  var strlib = sc.libs.strlib;

  describe("sc.libs.strlib", function() {
    it("article", function() {
      expect(strlib.article("apple")).to.equal("an");
      expect(strlib.article("banana")).to.equal("a");
    });
    it("isAlpha", function() {
      var trueCase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
      for (var i = 0; i < 256; ++i) {
        var ch = String.fromCharCode(i);
        expect(strlib.isAlpha(ch)).to.equal(trueCase.indexOf(ch) !== -1);
      }
    });
    it("isNumber", function() {
      var trueCase = "0123456789";
      for (var i = 0; i < 256; ++i) {
        var ch = String.fromCharCode(i);
        expect(strlib.isNumber(ch)).to.equal(trueCase.indexOf(ch) !== -1);
      }
    });
    it("format with args", function() {
      var str = strlib.format(
        "At #{0} in #{1}, the temperature was #{2} degrees.",
        "today", "Chicago", -16
      );
      expect(str).to.equal("At today in Chicago, the temperature was -16 degrees.");
    });
    it("format with list", function() {
      var str = strlib.format(
        "At #{0} in #{1}, the temperature was #{2} degrees.",
        [ "today", "Chicago", -16 ]
      );
      expect(str).to.equal("At today in Chicago, the temperature was -16 degrees.");
    });
    it("format with object", function() {
      var str = strlib.format(
        "At #{date} in #{city}, the temperature was #{degree} degrees.",
        { date: "today", city: "Chicago", degree: -16, "invalid!": null }
      );
      expect(str).to.equal("At today in Chicago, the temperature was -16 degrees.");
    });
  });
})();
