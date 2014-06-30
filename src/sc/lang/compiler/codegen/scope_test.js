(function() {
  "use strict";

  require("./scope");

  var Scope = sc.lang.compiler.Scope;

  var reVariableStatement = /^\s*var ([\w$]+)(, [\w$]+)*;\n$/;

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
    describe("temporary variables", function() {
      var scope = new Scope();

      var tempVars = [];
      scope.useTemporaryVariable(function(tempVar) {
        tempVars[0] = tempVar;
        scope.add("var", "a");
        scope.useTemporaryVariable(function(tempVar) {
          tempVars[1] = tempVar;
          scope.add("var", "b");
        });
      });
      // reset temporary variable counter
      scope.useTemporaryVariable(function(tempVar) {
        tempVars[2] = tempVar;
        scope.add("var", "c");
        scope.useTemporaryVariable(function(tempVar) {
          tempVars[3] = tempVar;
          scope.add("var", "d");
        });
      });
      var stmt = scope.toVariableStatement();
      stmt = compile(stmt);

      expect(stmt, 1).to.match(reVariableStatement);
      expect(stmt, 2).to.have.string("$a");
      expect(stmt, 3).to.have.string("$b");
      expect(stmt, 4).to.have.string("$c");
      expect(stmt, 5).to.have.string("$d");
      expect(stmt, 6).to.have.string(tempVars[0]);
      expect(stmt, 7).to.have.string(tempVars[1]);
      expect(tempVars[0], 8).to.not.equal(tempVars[1]);
      expect(tempVars[0], 9).to.equal(tempVars[2]);
      expect(tempVars[1],10).to.equal(tempVars[3]);
    });
  });
})();
