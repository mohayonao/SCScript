(function() {
  "use strict";

  require("./comment");

  var Token = sc.lang.compiler.Token;
  var lexComment = sc.lang.compiler.lexComment;

  describe("sc.lang.compiler.lexComment", function() {
    var test = function(items) {
      expect(lexComment(items[0], 1), items[0]).to.eql(items[1]);
    };
    it("SingleLineComment", function() {
      [
        [
          " // comment",
          { type: Token.SingleLineComment, value: "// comment", length: 10, line: 0 }
        ],
        [
          " // comment1\n// comment2",
          { type: Token.SingleLineComment, value: "// comment1\n", length: 12, line: 1 }
        ],
      ].forEach(test);
    });
    it("MultiLineComment", function() {
      [
        [
          " /* comment */",
          { type: Token.MultiLineComment, value: "/* comment */", length: 13, line: 0 }
        ],
        [
          " /* comment1\ncomment2\ncomment3 */",
          { type: Token.MultiLineComment,
            value: "/* comment1\ncomment2\ncomment3 */",
            length: 32,
            line: 2
          }
        ],
        [
          [
            " /* /* nested comment */ */",
          ].join("\n"),
          { type: Token.MultiLineComment,
            value: "/* /* nested comment */ */",
            length: 26,
            line: 0
          }
        ],
        [
          " /* ",
          { error: true, value: "ILLEGAL", length: 4, line: 0 }
        ],
      ].forEach(test);
    });
    it("Not a String", function() {
      [
        [ "(string)", undefined ],
      ].forEach(test);
    });
  });
})();
