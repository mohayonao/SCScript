(function() {
  "use strict";

  require("./lexer");

  var Token   = sc.lang.compiler.Token;
  var Message = sc.lang.compiler.Message;
  var Lexer   = sc.lang.compiler.lexer;

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

  describe("sc.lang.compiler.lexer", function() {
    it("Lexer", function() {
      var lexer, token, test;

      lexer = new Lexer("a = 0");
      test = lexer.getLocItems();

      expect(test).to.eql([ 0, 1, 0 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("a");
      expect(test).to.eql([ 1, 1, 1 ]);

      token = lexer.lex(true);
      test = lexer.getLocItems();
      expect(token.value).to.equal("=");
      expect(test).to.eql([ 3, 1, 3 ]);

      token.revert();
      token = lexer.lex(true);
      test = lexer.getLocItems();
      expect(token.value).to.equal("=");
      expect(test).to.eql([ 3, 1, 3 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("0");
      expect(test).to.eql([ 5, 1, 5 ]);

      token = lexer.lex();
      test = lexer.getLocItems();
      expect(token.value).to.equal("<EOF>");
      expect(test).to.eql([ 5, 1, 5 ]);
    });
    it("throw error from Lexer", function() {
      var lexer = new Lexer();
      expect(function() {
        lexer.throwError({
          range: [ 0, 0 ],
          lineNumber: 1,
          lintStart: 0
        }, "ERROR");
      }).to.throw("ERROR");
    });

    var cases = {
      "": [],
      "    \n\t": [],
      "// single line comment\n": [],
      "/*\n/* / * */\n*/": [],
      "/*": {
        error: [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "ILLEGAL"),
        ]
      },
      "a ": [
        {
          type: Token.Identifier,
          value: "a",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
      ],
      "_ ": [
        {
          type: Token.Identifier,
          value: "_",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
      ],
      "this ": [
        {
          type: Token.Keyword,
          value: "this",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      ],
      "thisThread ": [
        {
          type: Token.Keyword,
          value: "thisThread",
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 }
          }
        },
      ],
      "thisProcess ": [
        {
          type: Token.Keyword,
          value: "thisProcess",
          range: [ 0, 11 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 11 }
          }
        },
      ],
      "thisFunction ": [
        {
          type: Token.Keyword,
          value: "thisFunction",
          range: [ 0, 12 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 12 }
          }
        },
      ],
      "thisFunctionDef ": [
        {
          type: Token.Keyword,
          value: "thisFunctionDef",
          range: [ 0, 15 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 15 }
          }
        },
      ],
      "var ": [
        {
          type: Token.Keyword,
          value: "var",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "arg ": [
        {
          type: Token.Keyword,
          value: "arg",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "const ": [
        {
          type: Token.Keyword,
          value: "const",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
      ],
      "10 ": [
        {
          type: Token.IntegerLiteral,
          value: "10",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
      ],
      "-10": [
        {
          type: Token.IntegerLiteral,
          value: "-10",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "1_000": [
        {
          type: Token.IntegerLiteral,
          value: "1000",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
      ],
      "10pi": [
        {
          type: Token.FloatLiteral,
          value: "31.41592653589793",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      ],
      "-10.5e-1pi": [
        {
          type: Token.FloatLiteral,
          value: "-3.2986722862692828",
          range: [ 0, 10 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 10 }
          }
        },
      ],
      "1_0000.0000_0000e-1_000": [
        {
          type: Token.FloatLiteral,
          value: "0.0",
          range: [ 0, 23 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 23 }
          }
        },
      ],
      "2r1101": [
        {
          type: Token.IntegerLiteral,
          value: "13",
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 }
          }
        },
      ],
      "-2r1101": [
        {
          type: Token.IntegerLiteral,
          value: "-13",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 }
          }
        },
      ],
      "2r1101.0": [
        {
          type: Token.FloatLiteral,
          value: "13.0",
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
      ],
      "2r1101pi": [
        {
          type: Token.FloatLiteral,
          value: "40.840704496667314",
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
      ],
      "2r1.101": [
        {
          type: Token.FloatLiteral,
          value: "1.625",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 }
          }
        },
      ],
      "2r1a": {
        error: [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "a")
        ]
      },
      "2r1.Z": {
        error: [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "Z")
        ]
      },
      "0xff": [
        {
          type: Token.IntegerLiteral,
          value: "255",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      ],
      "2bb": [
        {
          type: Token.FloatLiteral,
          value: "1.8",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        }
      ],
      "2ss": [
        {
          type: Token.FloatLiteral,
          value: "2.2",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        }
      ],
      "2b10": [
        {
          type: Token.FloatLiteral,
          value: "1.99",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        }
      ],
      "2s10": [
        {
          type: Token.FloatLiteral,
          value: "2.01",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        }
      ],
      "pi ": [
        {
          type: Token.FloatLiteral,
          value: "3.141592653589793",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
      ],
      "-pi": [
        {
          type: Token.FloatLiteral,
          value: "-3.141592653589793",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "inf ": [
        {
          type: Token.FloatLiteral,
          value: "Infinity",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "-inf": [
        {
          type: Token.FloatLiteral,
          value: "-Infinity",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      ],
      "$.": [
        {
          type: Token.CharLiteral,
          value: ".",
          range: [ 0, 2 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 2 }
          }
        },
      ],
      "\\symbol": [
        {
          type: Token.SymbolLiteral,
          value: "symbol",
          range: [ 0, 7 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 7 }
          }
        },
      ],
      "\\": [
        {
          type: Token.SymbolLiteral,
          value: "",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
      ],
      "\\0123": [
        {
          type: Token.SymbolLiteral,
          value: "0123",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
      ],
      "'symbol'": [
        {
          type: Token.SymbolLiteral,
          value: "symbol",
          range: [ 0, 8 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 8 }
          }
        },
      ],
      "'symbol": {
        error: [
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, "ILLEGAL")
        ]
      },
      '"s\\tri\ng"': [
        {
          type: Token.StringLiteral,
          value: "s\\tri\\ng",
          range: [ 0, 9 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 2, column: 2 }
          }
        },
      ],
      '"string': {
        error: [
          error({ line: 1, column: 8, index: 7 }, Message.UnexpectedToken, "ILLEGAL")
        ]
      },
      "nil ": [
        {
          type: Token.NilLiteral,
          value: "nil",
          range: [ 0, 3 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "true ": [
        {
          type: Token.TrueLiteral,
          value: "true",
          range: [ 0, 4 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 4 }
          }
        },
      ],
      "false ": [
        {
          type: Token.FalseLiteral,
          value: "false",
          range: [ 0, 5 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 5 }
          }
        },
      ],
      "[]": [
        {
          type: Token.Punctuator,
          value: "[",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "]",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 }
          }
        },
      ],
      "#[]": [
        {
          type: Token.Punctuator,
          value: "#",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "[",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 }
          }
        },
        {
          type: Token.Punctuator,
          value: "]",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "{}": [
        {
          type: Token.Punctuator,
          value: "{",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "}",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 }
          }
        },
      ],
      "#{}": [
        {
          type: Token.Punctuator,
          value: "#",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "{",
          range: [ 1, 2 ],
          loc: {
            start: { line: 1, column: 1 },
            end: { line: 1, column: 2 }
          }
        },
        {
          type: Token.Punctuator,
          value: "}",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end: { line: 1, column: 3 }
          }
        },
      ],
      "label:": [
        {
          type: Token.Label,
          value: "label",
          range: [ 0, 6 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 6 }
          }
        },
      ],
      "^": {
        error: [
          error({ line: 1, column: 1, index: 0 }, Message.UnexpectedToken, "^")
        ]
      },
      "1 - 2": [
        {
          type: Token.IntegerLiteral,
          value: "1",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "-",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end: { line: 1, column: 3 }
          }
        },
        {
          type: Token.IntegerLiteral,
          value: "2",
          range: [ 4, 5 ],
          loc: {
            start: { line: 1, column: 4 },
            end: { line: 1, column: 5 }
          }
        },
      ],
      "1 / 2": [
        {
          type: Token.IntegerLiteral,
          value: "1",
          range: [ 0, 1 ],
          loc: {
            start: { line: 1, column: 0 },
            end: { line: 1, column: 1 }
          }
        },
        {
          type: Token.Punctuator,
          value: "/",
          range: [ 2, 3 ],
          loc: {
            start: { line: 1, column: 2 },
            end: { line: 1, column: 3 }
          }
        },
        {
          type: Token.IntegerLiteral,
          value: "2",
          range: [ 4, 5 ],
          loc: {
            start: { line: 1, column: 4 },
            end: { line: 1, column: 5 }
          }
        },
      ],
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
          var lexer;
          opts.tolerant = true;

          lexer = new Lexer(source, opts);
          lexer.tokenize();

          expect(lexer.errors).to.eql(error);
        });
      } else {
        mocha_it(s(source), function() {
          var lexer = new Lexer(source, opts);
          var test  = lexer.tokenize(source, opts);
          expect(test).to.eql(result);
        });
      }
    });
  });
})();
