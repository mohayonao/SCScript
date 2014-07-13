describe("sc.lang.io", function() {
  "use strict";

  it("post", sinon.test(function() {
    this.stub(SCScript, "stdout");

    sc.lang.io.post("abc");
    expect(SCScript.stdout).to.be.not.called;
    SCScript.stdout.reset();

    sc.lang.io.post("d\n");
    expect(SCScript.stdout).to.be.calledWith("abcd");
    SCScript.stdout.reset();

    sc.lang.io.post("abc\ndef\n");
    expect(SCScript.stdout).to.be.calledWith("abc");
    expect(SCScript.stdout).to.be.calledWith("def");
  }));

  it("warn", sinon.test(function() {
    this.stub(SCScript, "stderr");

    sc.lang.io.warn("abc");
    expect(SCScript.stderr).to.be.calledWith("abc");
  }));

});
