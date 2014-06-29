(function() {
  "use strict";

  require("./parser");
  require("./test-cases");

  describe("sc.lang.compiler.parser", function() {
    describe("parse", function() {
      _.chain(sc.test.compiler.cases).pairs().each(function(items) {
        var code = items[0], expected = items[1].ast;
        if (expected) {
          it(code, function() {
            var ast = sc.lang.compiler.parse(code);
            expect(ast).to.eql(expected);
          });
        }
      });
    });
  });
})();
