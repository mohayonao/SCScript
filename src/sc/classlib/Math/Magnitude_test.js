describe("Math/Magnitude", function() {
  "use strict";

  var testCase = sc.test.testCase;
  var $$ = sc.test.object;
  var $  = sc.lang.$;

  describe("SCMagnitude", function() {
    before(function() {
      this.createInstance = function(value) {
        var instance = $.Float(typeof value === "undefined" ? 0 : value);
        return $$(instance, "Magnitude" + this.test.title);
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
        [ 1, [ 2 ], $.Float(1.0) ],
        [ 2, [ 2 ], $.Float(2.0) ],
        [ 3, [ 2 ], 2 ],
      ]);
    });

    it("#max", function() {
      testCase(this, [
        [ 1, [ 2 ], 2 ],
        [ 2, [ 2 ], $.Float(2.0) ],
        [ 3, [ 2 ], $.Float(3.0) ],
      ]);
    });

    it("#clip", function() {
      testCase(this, [
        [ 1, [ 2, 4 ], 2 ],
        [ 2, [ 2, 4 ], 2 ],
        [ 3, [ 2, 4 ], $.Float(3.0) ],
        [ 4, [ 2, 4 ], 4 ],
        [ 5, [ 2, 4 ], 4 ],
      ]);
    });
  });

});
