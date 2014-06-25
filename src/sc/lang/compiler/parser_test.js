(function() {
  "use strict";

  require("./parser");
  require("./test-cases");

  var slice = [].slice;
  var strlib = sc.libs.strlib;
  var Syntax  = sc.lang.compiler.Syntax;
  var Token   = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;

  function s(str) {
    str = JSON.stringify(str);
    return '"' + str.substr(1, str.length - 2) + '"';
  }

  function error(options, messageFormat) {
    var description = strlib.format(messageFormat, slice.call(arguments, 2));

    var message;
    if (options.line !== -1) {
      message = "Line " + options.line + ": " + description;
    } else {
      message = description;
    }

    var e = new Error(message);
    e.index = options.index;
    e.lineNumber = options.line;
    e.column = options.column;
    e.description = description;

    return e;
  }

  describe("sc.lang.compiler.parser", function() {
    describe("parse", function() {
      var cases = sc.test.compiler.cases;
      Object.keys(cases).forEach(function(source) {
        var items = cases[source];
        var mocha$it, result, test;

        if (typeof items.ast === "undefined") {
          it.skip(s(source), function() {
          });
          return;
        }

        mocha$it = it[items.it] || it;

        if (items.ast) {
          if (items.ast instanceof Error) {
            mocha$it(s(source), function() {
              result = items.ast.message;
              expect(function() {
                SCScript.parse(source);
              }).to.throw(result);
            });
          } else {
            mocha$it(s(source), function() {
              result = items.ast;
              test   = SCScript.parse(source, { range: true, loc: true });
              expect(test).to.eql(result);
            });
          }
        }
      });
    });
    describe("parse with binary precedence", function() {
      var cases = {
        "1 + 2 * 3": {
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.BinaryExpression,
                operator: "*",
                left: {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Literal,
                    value: "1",
                    valueType: Token.IntegerLiteral,
                    range: [ 0, 1 ]
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "2",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ]
                  },
                  range: [ 0, 5 ]
                },
                right: {
                  type: Syntax.Literal,
                  value: "3",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 9 ]
                },
                range: [ 0, 9 ]
              }
            ],
            range: [ 0, 9 ]
          },
          binaryPrecedence: false
        },
        "4 + 5 * 6": {
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.BinaryExpression,
                operator: "+",
                left: {
                  type: Syntax.Literal,
                  value: "4",
                  valueType: Token.IntegerLiteral,
                  range: [ 0, 1 ]
                },
                right: {
                  type: Syntax.BinaryExpression,
                  operator: "*",
                  left: {
                    type: Syntax.Literal,
                    value: "5",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ]
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "6",
                    valueType: Token.IntegerLiteral,
                    range: [ 8, 9 ]
                  },
                  range: [ 4, 9 ]
                },
                range: [ 0, 9 ]
              }
            ],
            range: [ 0, 9 ]
          },
          binaryPrecedence: true
        },
        "7 + 8 * 9": {
          ast: {
            type: Syntax.Program,
            body: [
              {
                type: Syntax.BinaryExpression,
                operator: "*",
                left: {
                  type: Syntax.BinaryExpression,
                  operator: "+",
                  left: {
                    type: Syntax.Literal,
                    value: "7",
                    valueType: Token.IntegerLiteral,
                    range: [ 0, 1 ]
                  },
                  right: {
                    type: Syntax.Literal,
                    value: "8",
                    valueType: Token.IntegerLiteral,
                    range: [ 4, 5 ]
                  },
                  range: [ 0, 5 ]
                },
                right: {
                  type: Syntax.Literal,
                  value: "9",
                  valueType: Token.IntegerLiteral,
                  range: [ 8, 9 ]
                },
                range: [ 0, 9 ]
              }
            ],
            range: [ 0, 9 ]
          },
          binaryPrecedence: { "+": 2, "*": 1 }
        },
      };
      Object.keys(cases).forEach(function(source) {
        var items = cases[source];
        var mocha$it, result, test;

        mocha$it = it[items.it] || it;

        mocha$it(s(source), function() {
          result = items.ast;
          test   = SCScript.parse(source, {
            range: true, binaryPrecedence: items.binaryPrecedence
          });
          expect(test).to.eql(result);
        });
      });
    });
    describe("parse error", function() {
      var cases = {
        "日本語": [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "日"),
        ],
        "/*": [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "ILLEGAL"),
        ],
        "'": [
          error({ line: 1, column: 2, index: 1 }, Message.UnexpectedToken, "ILLEGAL"),
        ],
        "``": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedEOS),
        ],
        "[1": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedEOS),
        ],
        "(1": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedEOS),
        ],
        "(1..)": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, ")"),
        ],
        "(1, 3..)": [
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, ")"),
        ],
        "(1,..10)": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, ".."),
        ],
        "(..)": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, ")"),
        ],
        "{|a, a|}": [
          error({ line: 1, column: 7, index: 6 }, Message.ArgumentAlreadyDeclared, "a"),
        ],
        "{|0.0, a|}": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedNumber),
        ],
        "{|a...0| }": [
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedNumber),
        ],
        "var [ ];": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, "["),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "]"),
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, ";"),
        ],
        "var Bad;": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedIdentifier),
        ],
        "var a, a;": [
          error({ line: 1, column: 9, index: 8 }, Message.VariableAlreadyDeclared, "a"),
        ],
        "var _;": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedIdentifier),
        ],
        "var _a;": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, ";"),
        ],
        "a; var b;": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, "var"),
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 9, index: 8 }, Message.UnexpectedToken, ";"),
        ],
        "10 = a": [
          error({ line: 1, column: 3, index: 2 }, Message.InvalidLHSInAssignment),
        ],
        "#10 = []": [
          error({ line: 1, column: 2, index: 1 }, Message.UnexpectedNumber),
        ],
        "#a...10 = []": [
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedNumber),
        ],
        "{|a=#2}": [
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedNumber),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "}"),
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedEOS),
        ],
        "{arg a b;}": [
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 9, index: 8 }, Message.UnexpectedToken, ";")
        ],
        "_a = 0": [
          error({ line: 1, column: 2, index: 1 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, "="),
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedNumber),
        ],
        "a max : b": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, ":"),
          error({ line: 1, column: 9, index: 8 }, Message.UnexpectedIdentifier),
        ],
        "a +.[] c": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, "["),
          // error({ line: 1, column: 6, index: 5 }, Message.UnexpectedToken, "]"),
          // error({ line: 1, column: 8, index: 7 }, Message.UnexpectedIdentifier),
        ],
        "a[]": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, "]"),
        ],
        "a[1, 2]": [
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "]"),
        ],
        "a[,2..]": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedToken, ","),
        ],
        "(1, 2)": [
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedToken, ")"),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedEOS),
        ],
        "(, 2)": [
          error({ line: 1, column: 2, index: 1 }, Message.UnexpectedToken, ","),
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedNumber),
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, ")"),
        ],
        "(2..)": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, ")"),
        ],
        "(a:0, 1, 2)": [
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, ","),
        ],
        "a.0": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedNumber),
        ],
        "a.$a": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedLiteral, "char"),
        ],
        'a."a"': [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedLiteral, "string"),
        ],
        "a.'a'": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedLiteral, "symbol"),
        ],
        "a.SinOsc": [
          error({ line: 1, column: 3, index: 2 }, Message.UnexpectedIdentifier),
        ],
        "max()": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedToken, "("),
        ],
        "a.value(b:1, 10)": [
          error({ line: 1, column: 14, index: 13 }, Message.UnexpectedNumber),
          error({ line: 1, column: 16, index: 15 }, Message.UnexpectedToken, ")"),
        ],
        "a.value(b:1, *c)": [
          error({ line: 1, column: 14, index: 13 }, Message.UnexpectedToken, "*"),
        ],
        "a.value(*b, 10)": [
          error({ line: 1, column: 13, index: 12 }, Message.UnexpectedNumber),
          error({ line: 1, column: 15, index: 14 }, Message.UnexpectedToken, ")"),
        ],
        "a.value(1: 2)": [
          error({ line: 1, column: 10, index: 9 }, Message.UnexpectedToken, ":"),
        ],
        "a[0] {}": [
          error({ line: 1, column: 6, index: 5 }, Message.UnexpectedToken, "{"),
        ],
        "a[0] #{}": [
          // error({ line: 1, column: 6, index: 5 }, Message.UnexpectedToken, "#"),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "{"),
        ],
        "~10": [
          error({ line: 1, column: 2, index: 1 }, Message.UnexpectedNumber),
        ],
        "if (true) [0]": [
          error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "["),
        ],
        // "if (*a) {}": [
        //   error({ line: 1, column: 9, index: 8 }, Message.UnexpectedToken, "{"),
        // ],
        // "if (a:true) {}": [
        //   error({ line: 1, column:  4, index:  3 }, Message.UnexpectedToken, "("),
        //   error({ line: 1, column: 13, index: 12 }, Message.UnexpectedToken, "{"),
        // ],
        "if (true) #[]": [
          error({ line: 1, column: 12, index: 11 }, Message.UnexpectedToken, "["),
          error({ line: 1, column: 13, index: 12 }, Message.UnexpectedToken, "]"),
          error({ line: 1, column: 14, index: 13 }, Message.UnexpectedEOS),
        ],
        // "if (*a) #{}": [
        //   error({ line: 1, column: 10, index: 9 }, Message.UnexpectedToken, "{"),
        // ],
        // "if (a:true) #{}": [
        //   error({ line: 1, column:  4, index:  3 }, Message.UnexpectedToken, "("),
        //   error({ line: 1, column: 14, index: 13 }, Message.UnexpectedToken, "{"),
        // ],
        "a.() [0]": [
        ],
        "a.() #[0]": [
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "["),
          error({ line: 1, column: 9, index: 8 }, Message.UnexpectedToken, "]"),
          error({ line: 1, column: 10, index: 9 }, Message.UnexpectedEOS),
        ],
        "{: a, a<-[], b<-[] }": [
          error({ line: 1, column: 3, index: 2 }, Message.NotImplemented, "generator literal"),
        ],
        "if {: a, a <-[], a } ": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, ":"),
          error({ line: 1, column: 7, index: 6 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, ","),
          error({ line: 1, column: 10, index: 9 }, Message.UnexpectedIdentifier),
          error({ line: 1, column: 12, index: 11 }, Message.UnexpectedToken, "<-"),
          error({ line: 1, column: 16, index: 15 }, Message.UnexpectedToken, "]"),
          error({ line: 1, column: 20, index: 19 }, Message.UnexpectedToken, "}"),
        ],
        "a(1, 2, ": [
          error({ line: 1, column: 9, index: 8 }, Message.UnexpectedEOS),
        ],
        "a(a:)": [
          error({ line: 1, column: 5, index: 4 }, Message.UnexpectedToken, ")"),
        ],
        "a(a:0, b:)": [
          error({ line: 1, column: 10, index: 9 }, Message.UnexpectedToken, ")"),
        ],
        "if (true) (false)": [
          error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "("),
        ],
        "if (true) [ 1, 2, 3 ]": [
          error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "["),
          error({ line: 1, column: 17, index: 16 }, Message.UnexpectedToken, ","),
          error({ line: 1, column: 19, index: 18 }, Message.UnexpectedNumber),
          error({ line: 1, column: 21, index: 20 }, Message.UnexpectedToken, "]"),
        ],
        "if {true} (false)": [
          error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "("),
        ],
        "if {true} [ 1, 2, 3 ]": [
          error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "["),
          error({ line: 1, column: 17, index: 16 }, Message.UnexpectedToken, ","),
          error({ line: 1, column: 19, index: 18 }, Message.UnexpectedNumber),
          error({ line: 1, column: 21, index: 20 }, Message.UnexpectedToken, "]"),
        ],
        "~ID": [
          error({ line: 1, column: 4, index: 3 }, Message.UnexpectedIdentifier),
        ],
      };

      Object.keys(cases).forEach(function(source) {
        var result = cases[source];

        it(s(source), function() {
          var test = SCScript.parse(source, { tolerant: true });
          expect(test.errors).to.eql(result);
        });
      });
    });
  });
})();
