describe("sc.libs.charlib", function() {
  "use strict";

  var charlib = sc.libs.charlib;

  it("isAlpha", function() {
    var trueCase = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (var i = 0; i < 256; ++i) {
      var ch = String.fromCharCode(i);
      expect(charlib.isAlpha(ch)).to.equal(trueCase.indexOf(ch) !== -1);
    }
  });
  it("isNumber", function() {
    var trueCase = "0123456789";
    for (var i = 0; i < 256; ++i) {
      var ch = String.fromCharCode(i);
      expect(charlib.isNumber(ch)).to.equal(trueCase.indexOf(ch) !== -1);
    }
  });
  it("toNumber", function() {
    var nums = "0123456789abcdefghijklmnopqrstuvwxyz";
    for (var i = 0, imax = nums.length; i < imax; ++i) {
      var ch1 = nums.charAt(i);
      var ch2 = nums.charAt(i).toUpperCase();
      expect(charlib.toNumber(ch1), ch1).to.equal(i);
      expect(charlib.toNumber(ch2), ch2).to.equal(i);
    }
    expect(charlib.toNumber("!")).to.be.NaN;
  });

});
