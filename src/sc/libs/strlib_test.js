(function() {
  "use strict";

  require("./strlib");

  var strlib = sc.libs.strlib;

  describe("sc.libs.strlib", function() {
    it("article", function() {
      expect(strlib.article("apple")).to.equal("an");
      expect(strlib.article("banana")).to.equal("a");
    });
    it("methodIdentifier", function() {
      expect(strlib.methodIdentifier("A", "b", true )).to.equal("A.b");
      expect(strlib.methodIdentifier("A", "b", false)).to.equal("A#b");
    });
  });
})();
