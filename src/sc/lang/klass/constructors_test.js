(function() {
  "use strict";

  require("./constructors");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  describe("$", function() {
    it("Nil should return an instance of SCNil", function() {
      var a, b;
      a = $.Nil();
      expect(a).to.be.a("SCNil");

      b = $.Nil();
      expect(a).to.equal(b);
    });
    it("Symbol should return an instance of SCSymbol", function() {
      var a, b, c;
      a = $.Symbol("a");
      expect(a).to.be.a("SCSymbol").that.equal("a");

      b = $.Symbol("b");
      expect(a).to.not.equal(b);

      c = $.Symbol("b");
      expect(b).to.equal(c);
    });
    it("True should return an instance of SCTrue", function() {
      var a, b;
      a = $.True();
      expect(a).to.be.a("SCBoolean").that.is.true;

      b = $.True();
      expect(a).to.equal(b);
    });
    it("False should return an instance of SCFalse", function() {
      var a, b;
      a = $.False();
      expect(a).to.be.a("SCBoolean").that.is.false;

      b = $.False();
      expect(a).to.equal(b);
    });
    it("Boolean should return an instance of SCBoolean", function() {
      var a;
      a = $.Boolean(true);
      expect(a).to.be.a("SCBoolean").that.is.true;

      a = $.Boolean(false);
      expect(a).to.be.a("SCBoolean").that.is.false;
    });
    it("Char should return an instance of SCChar", function() {
      var a, b, c;
      a = $.Char("a");
      expect(a).to.be.a("SCChar").that.equal("a");

      b = $.Char("b");
      expect(a).to.not.equal(b);

      c = $.Char("b");
      expect(b).to.equal(c);
    });
    it("Integer should return an instance of SCInteger", function() {
      var a, b, c, d;
      a = $.Integer(0);
      expect(a).to.be.a("SCInteger").that.equal(0);

      b = $.Integer(1);
      expect(a).to.not.equal(b);

      c = $.Integer(1);
      expect(b).to.equal(c);

      d = $.Integer(Infinity);
      expect(d).to.be.a("SCFloat").that.equal(Infinity);
    });
    it("Float should return an instance of SCFloat", function() {
      var a, b, c;
      a = $.Float(0.0);
      expect(a).to.be.a("SCFloat").that.equal(0.0);

      b = $.Float(1.0);
      expect(a).to.not.equal(b);

      c = $.Float(1.0);
      expect(b).to.equal(c);
    });
    it("Array should return an instance of SCArray", function() {
      var a, b;
      a = $.Array();
      expect(a).to.be.a("SCArray").that.deep.equal([]);

      b = $.Array();
      expect(a).to.not.equal(b);
    });
    it("String should return an instance of SCString", function() {
      var a, b;
      a = $.String("");
      expect(a).to.be.a("SCString").that.deep.equal("");

      b = $.String("");
      expect(a).to.not.equal(b);
    });
    it("Event should return an instance of SCEvent", function() {
      var a;
      a = $.Event([ $.Integer(0), $.Integer(1) ]);
      expect(a).to.be.a("SCEvent").that.deep.equal({ 0: 1 });
    });
    it("Function should return an instance of SCFunction", function() {
      var f, test;

      f = $.Function(function() {
        return [ function($a) {
          return $a;
        } ];
      }, "a");
      expect(f).to.be.a("SCFunction");

      test = f.value($$(10));
      expect(test).to.be.a("SCInteger").that.equals(10);
    });
    it("Func is brief version Function", function() {
      var f, test;

      f = $.Func(function($_) {
        return $_;
      });
      expect(f).to.be.a("SCFunction");

      test = f.value($$(10));
      expect(test).to.be.a("SCInteger").that.equals(10);
    });
    it("Ref should return an instance of SCRef", function() {
      var a;
      a = $.Ref($.Integer(10));
      expect(a._$value).to.be.a("SCInteger").that.equals(10);
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
})();
