(function() {
  "use strict";

  require("./io");

  var io = sc.lang.io;

  describe("sc.lang.io", function() {
    it("post", sinon.test(function() {
      this.stub(sc.SCScript, "stdout");

      io.post("abc");
      expect(sc.SCScript.stdout).to.be.not.called;
      sc.SCScript.stdout.reset();

      io.post("d\n");
      expect(sc.SCScript.stdout).to.be.calledWith("abcd");
      sc.SCScript.stdout.reset();

      io.post("abc\ndef\n");
      expect(sc.SCScript.stdout).to.be.calledWith("abc");
      expect(sc.SCScript.stdout).to.be.calledWith("def");
      sc.SCScript.stdout.reset();
    }));
  });
})();
