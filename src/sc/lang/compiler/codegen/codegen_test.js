(function() {
  "use strict";

  require("./codegen");
  require("../rewriter/rewriter"); // TODO: remove
  require("../test-cases");

  var CodeGen  = sc.lang.compiler.CodeGen;
  var Syntax   = sc.lang.compiler.Syntax;
  var Token    = sc.lang.compiler.Message;
  var Rewriter = sc.lang.compiler.Rewriter;

  function toCompiledString(list) {
    return _.flatten(list).join("");
  }

  describe("sc.lang.compiler.CodeGen", function() {
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

        expect(test).to.equal("($a, $b, $c)");
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
          return this.addIndent("return;");
        });
        test = toCompiledString(test);

        expect(test).to.equal("function($a, $b) {\n  return;\n}");
      });
      it("withIndent / addIndent", function() {
        var codegen = new CodeGen();

        var test = codegen.withIndent(function() {
          return this.addIndent("testnode");
        });
        test = toCompiledString(test);
        expect(test).to.equal("  testnode");
      });
      it("insertArrayElement", function() {
        var codegen = new CodeGen();

        var test;
        test = codegen.insertArrayElement([ "a", "b", "c" ]);
        test = toCompiledString(test);
        expect(test).to.equal("[\n  $a,\n  $b,\n  $c,\n]");

        test = codegen.insertArrayElement([]);
        test = toCompiledString(test);
        expect(test).to.equal("[]");
      });
      it("insertKeyValueElement", function() {
        var codegen = new CodeGen();

        var test;
        test = codegen.insertKeyValueElement({ a: "a", b: "b" });
        test = toCompiledString(test);
        expect(test).to.equal("{ a: $a, b: $b }");

        test = codegen.insertKeyValueElement({ a: "a", b: "b" }, true);
        test = toCompiledString(test);
        expect(test).to.equal(", { a: $a, b: $b }");

        test = codegen.insertKeyValueElement(null, true);
        test = toCompiledString(test);
        expect(test).to.equal("");
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

  describe.skip("sc.lang.compiler.codegen", function() {
    function s(str) {
      str = JSON.stringify(str);
      return '"' + str.substr(1, str.length - 2) + '"';
    }

    describe("compile", function() {
      var cases = sc.test.compiler.cases;

      Object.keys(cases).forEach(function(source) {
        var items, compiled, ast, mocha$it;

        items = cases[source];

        compiled = items.compiled;

        if (typeof compiled === "undefined") {
          if (!(items.ast instanceof Error)) {
            it.skip(s(source), function() {
            });
          }
          return;
        }

        mocha$it = it[items.it] || it;
        ast = new Rewriter().rewrite(items.ast);
        if (!Array.isArray(compiled)) {
          compiled = [ compiled ];
        }

        mocha$it(s(source), function() {
          var code, test;

          code = compiled.join("\n");
          expect(function() {
            esprima.parse(code);
          }).to.not.throw();

          test = new CodeGen().compile(ast).split("\n");
          expect(test).to.eql(compiled);
        });
      });
    });
    describe("compile", function() {
      it("with bare", function() {
        var ast = {
          type: Syntax.Program,
          body: [
            {
              type: Syntax.Literal,
              value: "nil",
              valueType: Token.NilLiteral
            }
          ]
        };
        var source = new CodeGen(null, { bare: true }).compile(ast);
        var test = esprima.parse(source);
        var compiled = esprima.parse(
          "(function($) { return $.Nil(); })"
        );
        expect(test).to.be.eqls(compiled);
      });
    });
    describe("codegen error", function() {
      var cases = {
        "undef = 10;": {
          error: "not defined",
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.AssignmentExpression,
                operator: "=",
                left: {
                  type: Syntax.Identifier,
                  name: "undef"
                },
                right: {
                  type: Syntax.Literal,
                  value: "10",
                  valueType: Token.IntegerLiteral
                }
              }
            ]
          }
        },
      };
      Object.keys(cases).forEach(function(key) {
        var items = cases[key];
        var ast   = items.ast;
        var error = items.error;
        it(s(key), function() {
          var codegen = new CodeGen();
          expect(function() {
            codegen.compile(ast);
          }).to.throw(error);
        });
      });
    });
  });
})();
