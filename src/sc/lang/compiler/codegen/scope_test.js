(function() {
  "use strict";

  require("./scope");

  var Scope = sc.lang.compiler.Scope;

  function compile(list) {
    return _.flatten(list).join("");
  }

  describe("sc.lang.compiler.Scope", function() {
    it("find variables", function() {
      var scope = new Scope();

      expect(scope.find("a"), 1).to.be.false;

      scope.begin();
      scope.add("var", "a");

      expect(scope.find("a"), 2).to.be.true;

      scope.begin();
      scope.add("arg", "b");

      expect(scope.find("a"), 3).to.be.true;
      expect(scope.find("b"), 4).to.be.true;

      scope.end();

      expect(scope.find("a"), 5).to.be.true;
      expect(scope.find("b"), 6).to.be.false;

      scope.end();

      expect(scope.find("a"), 7).to.be.false;
    });
    describe("variable statement", function() {
      it("work", function() {
        var scope = new Scope();

        scope.add("var", "a");
        scope.add("var", "b");

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("var $a, $b;\n");
      });
      it("work with setIndent", function() {
        var scope = new Scope().setIndent("\t");

        scope.add("var", "a");
        scope.add("var", "b");

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("\tvar $a, $b;\n");
      });
      it("ignore duplicate", function() {
        var scope = new Scope();

        scope.add("var", "a");
        scope.add("var", "b");
        scope.add("var", "a");
        scope.add("var", "b");

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("var $a, $b;\n");
      });
      it("ignore arguments", function() {
        var scope = new Scope();

        scope.add("arg", "a");
        scope.add("arg", "b");

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("");
      });
      it("special variables (starts with _ or $)", function() {
        var scope = new Scope();

        scope.add("var", "_a");
        scope.add("var", "$b");

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("var _a, $b;\n");
      });
      it("nest test", function() {
        var scope = new Scope();

        scope.add("var", "a");

        scope.begin();
        scope.add("var", "b");

        var stmt1 = scope.toVariableStatement();
        expect(compile(stmt1)).to.equal("var $b;\n");

        scope.end();

        var stmt2 = scope.toVariableStatement();
        expect(compile(stmt2)).to.equal("var $a;\n");
      });
      it("hold outside scope", function() {
        var scope = new Scope();

        scope.add("var", "a");

        var peek = scope.peek();

        scope.begin();
        scope.add("var", "b", peek);
        scope.end();

        var stmt = scope.toVariableStatement();
        expect(compile(stmt)).to.equal("var $a, $b;\n");
      });
    });
  });
})();
