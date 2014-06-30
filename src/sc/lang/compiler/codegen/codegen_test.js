(function() {
  "use strict";

  require("./codegen");
  require("../rewriter/rewriter"); // TODO: remove
  require("../test-cases");

  var CodeGen  = sc.lang.compiler.CodeGen;
  var Syntax   = sc.lang.compiler.Syntax;
  var Token    = sc.lang.compiler.Message;
  var Rewriter = sc.lang.compiler.Rewriter;

  describe("sc.lang.compiler.codegen", function() {
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
        var source = new CodeGen({ bare: true }).compile(ast);
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
