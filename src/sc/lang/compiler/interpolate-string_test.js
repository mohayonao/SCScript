(function() {
  "use strict";

  require("./interpolate-string");

  var InterpolateString = sc.lang.compiler.InterpolateString;

  describe("sc.lang.compile.InterpolateString", function() {
    it(".hasInterpolateString", function() {
      [
        [ "I have 4 apples"                , false ],
        [ "I have #{apples} apples"        , true  ],
        [ "\\#{who} have\\#{apples} apples", false ],
      ].forEach(function(items) {
        var actual = InterpolateString.hasInterpolateString(items[0]);
        expect(actual, items[0]).to.equals(items[1]);
      });
    });
    it("#toCompiledString", function() {
      [
        [ "I have 4 apples", '"I have 4 apples"' ],
        [ "I have #{apples} apples", '"I have "++(apples).asString++" apples"' ],
        [ "I have #{#{n}.value} apples", '"I have "++(#{n}.value).asString++" apples"' ],
        [ "I have # apples", '"I have # apples"' ],
        [ "I have \\#{apples} apples", '"I have \\#{apples} apples"' ],
        [ "#{1+2", "(1+2).asString" ],
        [ "#{", "" ],
      ].forEach(function(items) {
        var actual = new InterpolateString(items[0]).toCompiledString();
        expect(actual, items[0]).to.equals(items[1]);
      });
    });
  });
})();
