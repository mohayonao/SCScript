describe("sc.lang.compiler.CodeGen", function() {
  "use strict";

  var CodeGen  = sc.lang.compiler.CodeGen;

  function toCompiledString(list) {
    return _.flatten(list).join("");
  }

  it("compile", function() {
    var codegen = new CodeGen();
    sinon.stub(codegen, "generate", sc.test.func());

    var ast = Math.random();
    var test = codegen.compile(ast);

    expect(codegen.generate).to.be.calledWith(ast);
    expect(codegen.generate).to.be.calledLastIn(test);
  });

  it("sub generator", function() {
    var codegen1 = new CodeGen(null);
    var codegen2 = new CodeGen(codegen1);
    expect(codegen2.state).to.equal(codegen1.state);
    expect(codegen2.scope).to.equal(codegen1.scope);
  });

  describe("generate", function() {
    it("null", function() {
      var codegen = new CodeGen();
      var test = codegen.generate(null);
      expect(test).to.equal("null");
    });

    it("string (variable identifier)", function() {
      var codegen = new CodeGen();
      var test = codegen.generate("a");
      expect(test).to.equal("$a");
    });

    it("list (expressions)", function() {
      var codegen = new CodeGen();
      var test = codegen.generate([ "a", "b", "c" ]);
      test = toCompiledString(test);

      expect(test).to.equal("($a,$b,$c)");
    });

    it("node", function() {
      var codegen = new CodeGen();
      codegen.TestNode1 = function() {
        return [ this.generate({ type: "TestNode2" }), [ "n", "o", "d", "e" ] ];
      };
      codegen.TestNode2 = function() {
        return "test";
      };
      var test = codegen.generate({ type: "TestNode1" });
      expect(test).to.equal("testnode");
    });
  });

  describe("utilities", function() {
    it("withFunction", function() {
      var codegen = new CodeGen();

      var test = codegen.withFunction([ "a", "b" ], function() {
        return "return;";
      });
      test = toCompiledString(test);

      expect(test).to.equal("function($a,$b){return;}");
    });

    it("insertArrayElement", function() {
      var codegen = new CodeGen();

      var test;
      test = codegen.insertArrayElement([ "a", "b", "c" ]);
      test = toCompiledString(test);
      expect(test).to.equal("[$a,$b,$c]");

      test = codegen.insertArrayElement([]);
      test = toCompiledString(test);
      expect(test).to.equal("[]");
    });

    it("generateStatements", function() {
      var codegen = new CodeGen();

      var test;
      test = codegen.generateStatements([ "a", "b", "c" ]);
      test = toCompiledString(test);
      expect(test).to.equal("$a;$b;return $c;");
    });

    it("useTemporaryVariable", function() {
      var codegen = new CodeGen();

      var tempVars = [];
      codegen.useTemporaryVariable(function(tempVar) {
        tempVars[0] = tempVar;
        codegen.useTemporaryVariable(function(tempVar) {
          tempVars[1] = tempVar;
        });
      });
      // reset temporary variable counter
      codegen.useTemporaryVariable(function(tempVar) {
        tempVars[2] = tempVar;
        codegen.useTemporaryVariable(function(tempVar) {
          tempVars[3] = tempVar;
        });
      });

      expect(tempVars[0]).to.be.match(/^_/);
      expect(tempVars[1]).to.be.match(/^_/);
      expect(tempVars[0]).to.not.equal(tempVars[1]);
      expect(tempVars[2]).to.equal(tempVars[0]);
      expect(tempVars[3]).to.equal(tempVars[1]);
    });

    it("throwError", function() {
      var codegen = new CodeGen();

      expect(function() {
        codegen.throwError({}, "error");
      }).to.throw("error");
    });
  });

});
