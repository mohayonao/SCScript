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
    it("isClasName", function() {
      expect(strlib.isClassName("Object")).to.be.true;
      expect(strlib.isClassName("object")).to.be.false;
    });
    it("char2num", function() {
      var nums = "0123456789abcdefghijklmnopqrstuvwxyz";
      for (var i = 0, imax = nums.length; i < imax; ++i) {
        var ch1 = nums.charAt(i);
        var ch2 = nums.charAt(i).toUpperCase();
        expect(strlib.char2num(ch1), ch1).to.equal(i);
        expect(strlib.char2num(ch2), ch2).to.equal(i);
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
