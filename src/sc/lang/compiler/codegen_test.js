(function() {
  "use strict";

  require("./codegen");
  require("./test-cases");

  var codegen  = sc.lang.compiler.codegen;
  var Syntax   = sc.lang.compiler.Syntax;
  var Token    = sc.lang.compiler.Message;

  describe("sc.lang.compiler.codegen", function() {
    function s(str) {
      str = JSON.stringify(str);
      return '"' + str.substr(1, str.length - 2) + '"';
    }

    describe("compile", function() {
      var cases = sc.test.compiler.cases;

      Object.keys(cases).forEach(function(source) {
        var items, compiled, ast, mocha_it;

        items = cases[source];

        compiled = items.compiled;

        if (typeof compiled === "undefined") {
          if (!(items.ast instanceof Error)) {
            it.skip(s(source), function() {
            });
          }
          return;
        }

        mocha_it = it[items.it] || it;
        ast      = items.ast;
        if (!Array.isArray(compiled)) {
          compiled = [ compiled ];
        }

        mocha_it(s(source), function() {
          var code, test;

          code = compiled.join("\n");
          expect(function() {
            esprima.parse(code);
          }).to.not.throw();

          test = codegen.compile(ast).split("\n");
          expect(test).to.eqls(compiled);
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
              value: "null",
              valueType: Token.NilLiteral
            }
          ]
        };
        var source = codegen.compile(ast, { bare: true });
        var test = esprima.parse(source);
        var compiled = esprima.parse(
          "(function($this, $SC) { return $SC.Nil(); })"
        );
        expect(test).to.be.eqls(compiled);
      });
    });
    describe("codegen error", function() {
      var cases = {
        "var a, a;": {
          error: "already declared",
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.VariableDeclaration,
                kind: "var",
                declarations: [
                  {
                    type: Syntax.VariableDeclarator,
                    id: {
                      type: Syntax.Identifier,
                      name: "a",
                    },
                  },
                  {
                    type: Syntax.VariableDeclarator,
                    id: {
                      type: Syntax.Identifier,
                      name: "a",
                    },
                  },
                ]
              }
            ]
          }
        },
        "{|a, a| }": {
          error: "already declared",
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.FunctionExpression,
                args: {
                  list: [
                    {
                      type: Syntax.VariableDeclarator,
                      id: {
                        type: Syntax.Identifier,
                        name: "a"
                      },
                    },
                    {
                      type: Syntax.VariableDeclarator,
                      id: {
                        type: Syntax.Identifier,
                        name: "a"
                      },
                    },
                  ]
                },
                body: []
              }
            ]
          }
        },
        "{|a| var a; }": {
          error: "already declared",
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.FunctionExpression,
                args: {
                  list: [
                    {
                      type: Syntax.VariableDeclarator,
                      id: {
                        type: Syntax.Identifier,
                        name: "a"
                      },
                    }
                  ]
                },
                body: [
                  {
                    type: Syntax.VariableDeclaration,
                    kind: "var",
                    declarations: [
                      {
                        type: Syntax.VariableDeclarator,
                        id: {
                          type: Syntax.Identifier,
                          name: "a",
                        },
                      },
                    ]
                  }
                ]
              }
            ]
          }
        },
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
        it("s(key)", function() {
          expect(function() {
            codegen.compile(ast);
          }).to.throw(error);
        });
      });
    });
  });
})();
