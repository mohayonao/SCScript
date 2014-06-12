(function() {
  "use strict";

  require("./bytecode");

  var $$ = sc.test.object;

  var bytecode = sc.lang.bytecode;

  describe("sc.lang.bytecode", function() {
    it("empty function", function() {
      var f, test;

      f = bytecode.create(function() {
        return [];
      });

      test = f.resume();
      expect(test).to.be.a("SCNil");
    });
    it("resume", function() {
      var f, test;

      f = bytecode.create(function() {
        return [ function($a, $b) {
          return $$([ $a, $b ]);
        } ];
      }, "a=0; b=1");

      test = f.resume();
      expect(test).to.be.a("SCArray").to.eql([ 0, 1 ]);
    });
    it("break", function() {
      var f, test;

      f = bytecode.create(function() {
        return [ function() {
          this.__break__();
        } ];
      });

      test = f.resume();
      expect(test).to.be.a("JSNumber").to.equal(sc.C.LOOP_BREAK);
    });
  });

})();
