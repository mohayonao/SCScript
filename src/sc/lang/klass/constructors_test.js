describe("$", function() {
  "use strict";

  var $$ = sc.test.object;
  var $  = sc.lang.$;

  it("Nil should return an instance of SCNil", function() {
    expect($.Nil()).to.be.a("SCNil");
    expect($.Nil()).to.equal($.Nil());
  });

  it("Symbol should return an instance of SCSymbol", function() {
    expect($.Symbol("a")).to.be.a("SCSymbol").that.equal("a");
    expect($.Symbol("a")).to.not.equal($.Symbol("b"));
    expect($.Symbol("b")).to.equal($.Symbol("b"));
  });

  it("True should return an instance of SCTrue", function() {
    expect($.True()).to.be.a("SCBoolean").that.is.true;
    expect($.True()).to.equal($.True());
  });

  it("False should return an instance of SCFalse", function() {
    expect($.False()).to.be.a("SCBoolean").that.is.false;
    expect($.False()).to.equal($.False());
  });

  it("Boolean should return an instance of SCBoolean", function() {
    expect($.Boolean(true)).to.be.a("SCBoolean").that.is.true;
    expect($.Boolean(false)).to.be.a("SCBoolean").that.is.false;
  });

  it("Char should return an instance of SCChar", function() {
    expect($.Char("a")).to.be.a("SCChar").that.equal("a");
    expect($.Char("a")).to.not.equal($.Char("b"));
    expect($.Char("b")).to.equal($.Char("b"));
  });

  it("Integer should return an instance of SCInteger", function() {
    expect($.Integer(0)).to.be.a("SCInteger").that.equal(0);
    expect($.Integer(0)).to.not.equal($.Integer(1));
    expect($.Integer(1)).to.equal($.Integer(1));
    expect($.Integer(Infinity)).to.be.a("SCFloat").that.equal(Infinity);
  });

  it("Float should return an instance of SCFloat", function() {
    expect($.Float(0.0)).to.be.a("SCFloat").that.equal(0.0);
    expect($.Float(0.0)).to.not.equal($.Float(1.0));
    expect($.Float(1.0)).to.equal($.Float(1.0));
  });

  it("Array should return an instance of SCArray", function() {
    expect($.Array()).to.be.a("SCArray").that.deep.equal([]);
    expect($.Array()).to.not.equal($.Array());
  });

  it("String should return an instance of SCString", function() {
    expect($.String("")).to.be.a("SCString").that.deep.equal("");
    expect($.String("")).to.not.equal($.String(""));
  });

  it("Event should return an instance of SCEvent", function() {
    expect(
      $.Event([ $.Integer(0), $.Integer(1) ])
    ).to.be.a("SCEvent").that.deep.equal({ 0: 1 });
  });

  it("Function should return an instance of SCFunction", function() {
    var f = $.Function(function() {
      return [ function($a) {
        return $a;
      } ];
    }, "a");

    expect(f).to.be.a("SCFunction");
    expect(f.value($$(10))).to.be.a("SCInteger").that.equals(10);
  });

  it("Func is brief version Function", function() {
    var f = $.Func(function($_) {
      return $_;
    });

    expect(f).to.be.a("SCFunction");
    expect(f.value($$(10))).to.be.a("SCInteger").that.equals(10);
  });

  it("Ref should return an instance of SCRef", function() {
    expect($.Ref($$(10))).to.be.a("SCRef").that.equals(10);
  });

  it("$.nil", function() {
    expect($.nil).to.be.a("SCNil");
  });

  it("$.true", function() {
    expect($.true).to.be.a("SCBoolean").that.is.true;
  });

  it("$.false", function() {
    expect($.false).to.be.a("SCBoolean").that.is.false;
  });

  it("$.int0", function() {
    expect($.int0).to.be.a("SCInteger").that.equals(0);
  });

  it("$.int1", function() {
    expect($.int1).to.be.a("SCInteger").that.equals(1);
  });

});
