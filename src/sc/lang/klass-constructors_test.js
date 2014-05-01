(function() {
  "use strict";

  require("./klass-constructors");

  var $SC = sc.lang.$SC;

  describe("$SC", function() {
    it("Nil should return an instance of SCNil", function() {
      var a, b;
      a = $SC.Nil();
      expect(a).to.be.a("SCNil");

      b = $SC.Nil();
      expect(a).to.equal(b);
    });
    it("Symbol should return an instance of SCSymbol", function() {
      var a, b, c;
      a = $SC.Symbol("a");
      expect(a).to.be.a("SCSymbol").that.equal("a");

      b = $SC.Symbol("b");
      expect(a).to.not.equal(b);

      c = $SC.Symbol("b");
      expect(b).to.equal(c);
    });
    it("True should return an instance of SCTrue", function() {
      var a, b;
      a = $SC.True();
      expect(a).to.be.a("SCBoolean").that.is.true;

      b = $SC.True();
      expect(a).to.equal(b);
    });
    it("False should return an instance of SCFalse", function() {
      var a, b;
      a = $SC.False();
      expect(a).to.be.a("SCBoolean").that.is.false;

      b = $SC.False();
      expect(a).to.equal(b);
    });
    it("Boolean should return an instance of SCBoolean", function() {
      var a;
      a = $SC.Boolean(true);
      expect(a).to.be.a("SCBoolean").that.is.true;

      a = $SC.Boolean(false);
      expect(a).to.be.a("SCBoolean").that.is.false;
    });
    it("Char should return an instance of SCChar", function() {
      var a, b, c;
      a = $SC.Char("a");
      expect(a).to.be.a("SCChar").that.equal("a");

      b = $SC.Char("b");
      expect(a).to.not.equal(b);

      c = $SC.Char("b");
      expect(b).to.equal(c);
    });
    it("Integer should return an instance of SCInteger", function() {
      var a, b, c, d;
      a = $SC.Integer(0);
      expect(a).to.be.a("SCInteger").that.equal(0);

      b = $SC.Integer(1);
      expect(a).to.not.equal(b);

      c = $SC.Integer(1);
      expect(b).to.equal(c);

      d = $SC.Integer(Infinity);
      expect(d).to.be.a("SCFloat").that.equal(Infinity);
    });
    it("Float should return an instance of SCFloat", function() {
      var a, b, c;
      a = $SC.Float(0.0);
      expect(a).to.be.a("SCFloat").that.equal(0.0);

      b = $SC.Float(1.0);
      expect(a).to.not.equal(b);

      c = $SC.Float(1.0);
      expect(b).to.equal(c);
    });
    it("Array should return an instance of SCArray", function() {
      var a, b;
      a = $SC.Array();
      expect(a).to.be.a("SCArray").that.eql([]);

      b = $SC.Array();
      expect(a).to.not.equal(b);
    });
    it("String should return an instance of SCString", function() {
      var a, b;
      a = $SC.String("");
      expect(a).to.be.a("SCString").that.eql("");

      b = $SC.String("");
      expect(a).to.not.equal(b);
    });
    it("Function should return an instance of SCFunction", function() {
      var a;
      a = $SC.Function(function() {});
      expect(a).to.be.a("SCFunction");
    });
  });

})();
