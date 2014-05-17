(function() {
  "use strict";

  require("./Magnitude");

  var testCase = sc.test.testCase;

  var $SC = sc.lang.$SC;

  describe("SCMagnitude", function() {
    var SCMagnitude;
    before(function() {
      SCMagnitude = $SC("Magnitude");
      this.createInstance = function(value) {
        var instance = $SC.Float(typeof value === "undefined" ? 0 : value);
        var testMethod = this.test.title.substr(1);
        sc.test.setSingletonMethod(instance, "Magnitude", testMethod);
        return instance;
      };
    });
    it("#==", function() {
      testCase(this, [
        [ 1, [ 2 ], false ],
        [ 2, [ 2 ], true  ],
        [ 3, [ 2 ], false ],
      ]);
    });
    it("#!=", function() {
      testCase(this, [
        [ 1, [ 2 ], true  ],
        [ 2, [ 2 ], false ],
        [ 3, [ 2 ], true  ],
      ]);
    });
    it("#<", function() {
      testCase(this, [
        [ 1, [ 2 ], true  ],
        [ 2, [ 2 ], false ],
        [ 3, [ 2 ], false ],
      ]);
    });
    it("#>", function() {
      testCase(this, [
        [ 1, [ 2 ], false ],
        [ 2, [ 2 ], false ],
        [ 3, [ 2 ], true  ],
      ]);
    });
    it("#<=", function() {
      testCase(this, [
        [ 1, [ 2 ], true  ],
        [ 2, [ 2 ], true  ],
        [ 3, [ 2 ], false ],
      ]);
    });
    it("#>=", function() {
      testCase(this, [
        [ 1, [ 2 ], false ],
        [ 2, [ 2 ], true  ],
        [ 3, [ 2 ], true  ],
      ]);
    });
    it("#exclusivelyBetween", function() {
      testCase(this, [
        [ 1, [ 2, 4 ], false ],
        [ 2, [ 2, 4 ], false ],
        [ 3, [ 2, 4 ], true  ],
        [ 4, [ 2, 4 ], false ],
        [ 5, [ 2, 4 ], false ],
      ]);
    });
    it("#inclusivelyBetween", function() {
      testCase(this, [
        [ 1, [ 2, 4 ], false ],
        [ 2, [ 2, 4 ], true  ],
        [ 3, [ 2, 4 ], true  ],
        [ 4, [ 2, 4 ], true  ],
        [ 5, [ 2, 4 ], false ],
      ]);
    });
    it("#min", function() {
      testCase(this, [
        [ 1, [ 2 ], $SC.Float(1.0) ],
        [ 2, [ 2 ], $SC.Float(2.0) ],
        [ 3, [ 2 ], 2 ],
      ]);
    });
    it("#max", function() {
      testCase(this, [
        [ 1, [ 2 ], 2 ],
        [ 2, [ 2 ], $SC.Float(2.0) ],
        [ 3, [ 2 ], $SC.Float(3.0) ],
      ]);
    });
    it("#clip", function() {
      testCase(this, [
        [ 1, [ 2, 4 ], 2 ],
        [ 2, [ 2, 4 ], 2 ],
        [ 3, [ 2, 4 ], $SC.Float(3.0) ],
        [ 4, [ 2, 4 ], 4 ],
        [ 5, [ 2, 4 ], 4 ],
      ]);
    });
  });
})();
