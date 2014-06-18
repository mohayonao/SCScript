(function() {
  "use strict";

  require("./io");

  var io = sc.lang.io;

  describe("sc.lang.io", function() {
    it("post", sinon.test(function() {
      this.stub(SCScript, "stdout");

      io.post("abc");
      expect(SCScript.stdout).to.be.not.called;
      SCScript.stdout.reset();

      io.post("d\n");
      expect(SCScript.stdout).to.be.calledWith("abcd");
      SCScript.stdout.reset();

      io.post("abc\ndef\n");
      expect(SCScript.stdout).to.be.calledWith("abc");
      expect(SCScript.stdout).to.be.calledWith("def");
      SCScript.stdout.reset();
    }));
    it("warn", sinon.test(function() {
      this.stub(SCScript, "stderr");

      io.warn("abc");
      expect(SCScript.stderr).to.be.calledWith("abc");
    }));
  });

})();
