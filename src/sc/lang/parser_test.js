"use strict";

require("./parser");
require("../test/parser-test-case");

var SCScript = sc.SCScript;
var Syntax  = sc.lang.parser.Syntax;
var Token   = sc.lang.parser.Token;
var Message = sc.lang.parser.Message;

describe("sc.lang.parser", function() {
  function s(str) {
    str = JSON.stringify(str);
    return '"' + str.substr(1, str.length - 2) + '"';
  }

  function error(options, messageFormat) {
    var e, args, description, message;

    args = Array.prototype.slice.call(arguments, 2);
    description = messageFormat.replace(/%(\d)/g, function(whole, index) {
      return args[index];
    });

    if (options.line !== -1) {
      message = "Line " + options.line + ": " + description;
    } else {
      message = description;
    }

    e = new Error(message);
    e.index = options.index;
    e.lineNumber = options.line;
    e.column = options.column;
    e.description = description;

    return e;
  }

  describe("tokenize", function() {
    var cases = {
      "": [],
      "a": [
        {
          type: "Identifier",
          value: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 1 }
          }
        },
      ],
      "this": [
        {
          type: "Keyword",
          value: "this",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 4 }
          }
        },
      ],
      "thisThread": [
        {
          type: "Keyword",
          value: "thisThread",
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 10 }
          }
        },
      ],
      "thisProcess": [
        {
          type: "Keyword",
          value: "thisProcess",
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 11 }
          }
        },
      ],
      "thisFunction": [
        {
          type: "Keyword",
          value: "thisFunction",
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 12 }
          }
        },
      ],
      "thisFunctionDef": [
        {
          type: "Keyword",
          value: "thisFunctionDef",
          range: [ 0, 15 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 15 }
          }
        },
      ],
      "var": {
        error : "unexpected",
      },
      "arg": {
        error : "unexpected",
      },
      "const": {
        error : "unexpected",
      },
      "10": [
        {
          type: "Integer",
          value: "10",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 2 }
          }
        },
      ],
      "-10": [
        {
          type: "Integer",
          value: "-10",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "+10": {
        error : "unexpected"
      },
      "1_000": [
        {
          type: "Integer",
          value: "1_000",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 5 }
          }
        },
      ],
      "1_": {
        error : "unexpected"
      },
      "1__000": {
        error : "unexpected"
      },
      "10pi": [
        {
          type: "Float",
          value: "10pi",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 4 }
          }
        },
      ],
      "-10.5e-1pi": [
        {
          type: "Float",
          value: "-10.5e-1pi",
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 10 }
          }
        },
      ],
      "1_0000.0000_0000e-1_000": [
        {
          type: "Float",
          value: "1_0000.0000_0000e-1_000",
          range: [ 0, 23 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 23 }
          }
        },
      ],
      "2r1101": [
        {
          type: "Integer",
          value: "2r1101",
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 6 }
          }
        },
      ],
      "-2r1101": [
        {
          type: "Integer",
          value: "-2r1101",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 7 }
          }
        },
      ],
      "2r1101pi": [
        {
          type: "Float",
          value: "2r1101pi",
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 8 }
          }
        },
      ],
      "2r1.101": [
        {
          type: "Float",
          value: "2r1.101",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 7 }
          }
        },
      ],
      "2r1a": {
        error : "unexpected"
      },
      "2r1.Z": {
        error : "unexpected"
      },
      "pi": [
        {
          type: "Float",
          value: "pi",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 2 }
          }
        },
      ],
      "-pi": [
        {
          type: "Float",
          value: "-pi",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "inf": [
        {
          type: "Float",
          value: "inf",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "-inf": [
        {
          type: "Float",
          value: "-inf",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 4 }
          }
        },
      ],
      "$.": [
        {
          type: "Char",
          value: "$.",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 2 }
          }
        },
      ],
      "$ch": {
        error : "unexpected"
      },
      "\\symbol": [
        {
          type: "Symbol",
          value: "\\symbol",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 7 }
          }
        },
      ],
      "\\00_symbol": {
        error : "unexpected"
      },
      "'symbol'": [
        {
          type: "Symbol",
          value: "'symbol'",
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 8 }
          }
        },
      ],
      "'symbol": {
        error : "unexpected"
      },
      '"s\\tri\ng"': [
        {
          type: "String",
          value: '"s\\tri\ng"',
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 2, column: 2 }
          }
        },
      ],
      '"string': {
        error : "unexpected"
      },
      "nil": [
        {
          type: "Nil",
          value: "nil",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "true": [
        {
          type: "Boolean",
          value: "true",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 4 }
          }
        },
      ],
      "false": [
        {
          type: "Boolean",
          value: "false",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 5 }
          }
        },
      ],
      "[]": [
        {
          type: "Punctuator",
          value: "[",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 1 }
          }
        },
        {
          type: "Punctuator",
          value: "]",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end  : { line: 1, column: 2 }
          }
        },
      ],
      "#[]": [
        {
          type: "Punctuator",
          value: "#",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 1 }
          }
        },
        {
          type: "Punctuator",
          value: "[",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end  : { line: 1, column: 2 }
          }
        },
        {
          type: "Punctuator",
          value: "]",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "{}": [
        {
          type: "Punctuator",
          value: "{",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 1 }
          }
        },
        {
          type: "Punctuator",
          value: "}",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end  : { line: 1, column: 2 }
          }
        },
      ],
      "#{}": [
        {
          type: "Punctuator",
          value: "#",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end  : { line: 1, column: 1 }
          }
        },
        {
          type: "Punctuator",
          value: "{",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end  : { line: 1, column: 2 }
          }
        },
        {
          type: "Punctuator",
          value: "}",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end  : { line: 1, column: 3 }
          }
        },
      ],
      "^": {
        error : "unexpected"
      }
    };

    Object.keys(cases).forEach(function(source) {
      var items, opts, result, error;
      var mocha_it;

      items = cases[source];

      if (Array.isArray(items)) {
        opts   = { range: true, loc: true };
        result = items;
        error  = null;
        mocha_it = it;
      } else {
        opts   = items.opts || {};
        result = items.result;
        error  = items.error;
        mocha_it = it[items.it] || it;
      }

      if (error) {
        mocha_it(s(source) + " should throw error", function() {
          expect(function() {
            SCScript.tokenize(source, opts);
          }).to.throw(error);
        });
      } else {
        mocha_it(s(source), function() {
          var test = SCScript.tokenize(source, opts);
          expect(test).to.eqls(result);
        });
      }
    });
  });
  describe("parse", function() {
    var cases = sc.test.parser.cases;
    Object.keys(cases).forEach(function(source) {
      var items = cases[source];
      var mocha_it, result, test;

      mocha_it = it[items.it] || it;

      if (items.ast) {
        if (items.ast instanceof Error) {
          mocha_it(s(source), function() {
            result = items.ast.message;
            expect(function() {
              SCScript.parse(source);
            }).to.throw(result);
          });
        } else {
          mocha_it(s(source), function() {
            result = items.ast;
            test   = SCScript.parse(source, { range: true, loc: true });
            expect(test).to.eqls(result);
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
      var mocha_it, result, test;

      mocha_it = it[items.it] || it;

      mocha_it(s(source), function() {
        result = items.ast;
        test   = SCScript.parse(source, { range: true, binaryPrecedence: items.binaryPrecedence });
        expect(test).to.eqls(result);
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
        error({ line: 1, column: 4, index: 3 }, Message.InvalidLHSInAssignment),
      ],
      "#a...10 = []": [
        error({ line: 1, column: 8, index: 7 }, Message.InvalidLHSInAssignment),
      ],
      "{|a=#2}": [
        error({ line: 1, column: 6, index: 5 }, Message.UnexpectedNumber),
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
      "a.0": [
        error({ line: 1, column: 3, index: 2 }, Message.UnexpectedNumber),
      ],
      "a.$a": [
        error({ line: 1, column: 3, index: 2 }, Message.UnexpectedChar),
      ],
      'a."a"': [
        error({ line: 1, column: 3, index: 2 }, Message.UnexpectedString),
      ],
      "a.'a'": [
        error({ line: 1, column: 3, index: 2 }, Message.UnexpectedSymbol),
      ],
      "a.SinOsc": [
        error({ line: 1, column: 3, index: 2 }, Message.UnexpectedIdentifier),
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
        error({ line: 1, column: 6, index: 5 }, Message.UnexpectedToken, "#"),
        error({ line: 1, column: 7, index: 6 }, Message.UnexpectedToken, "{"),
      ],
      "~10": [
        error({ line: 1, column: 2, index: 1 }, Message.UnexpectedNumber),
      ],
      "if (true) [0]": [
        error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, "["),
      ],
      "if (*a) {}": [
        error({ line: 1, column: 9, index: 8 }, Message.UnexpectedToken, "{"),
      ],
      "if (a:true) {}": [
        error({ line: 1, column: 13, index: 12 }, Message.UnexpectedToken, "{"),
      ],
      "if (true) #[]": [
        error({ line: 1, column: 12, index: 11 }, Message.UnexpectedToken, "["),
        error({ line: 1, column: 13, index: 12 }, Message.UnexpectedToken, "]"),
        error({ line: 1, column: 14, index: 13 }, Message.UnexpectedEOS),
      ],
      "if (*a) #{}": [
        error({ line: 1, column: 10, index: 9 }, Message.UnexpectedToken, "{"),
      ],
      "if (a:true) #{}": [
        error({ line: 1, column: 14, index: 13 }, Message.UnexpectedToken, "{"),
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
      "if {true} .value": [
        error({ line: 1, column: 11, index: 10 }, Message.UnexpectedToken, ".")
      ],
    };

    Object.keys(cases).forEach(function(source) {
      var result = cases[source];

      it(s(source), function() {
        var test = SCScript.parse(source, { tolerant: true });
        expect(test.errors).to.eqls(result);
      });
    });
  });
});
