(function() {
  "use strict";

  require("./BasicOpsStream");

  var $SC = sc.lang.$SC;

  describe("SCUnaryOpStream", function() {
    var SCUnaryOpStream;
    before(function() {
      SCUnaryOpStream = $SC("UnaryOpStream");
      this.createInstance = function() {
        return SCUnaryOpStream.new();
      };
    });
    it.skip("#next", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpStream", function() {
    var SCBinaryOpStream;
    before(function() {
      SCBinaryOpStream = $SC("BinaryOpStream");
      this.createInstance = function() {
        return SCBinaryOpStream.new();
      };
    });
    it.skip("#next", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCBinaryOpXStream", function() {
    var SCBinaryOpXStream;
    before(function() {
      SCBinaryOpXStream = $SC("BinaryOpXStream");
      this.createInstance = function() {
        return SCBinaryOpXStream.new();
      };
    });
    it.skip("#next", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#storeOn", function() {
    });
  });

  describe("SCNAryOpStream", function() {
    var SCNAryOpStream;
    before(function() {
      SCNAryOpStream = $SC("NAryOpStream");
      this.createInstance = function() {
        return SCNAryOpStream.new();
      };
    });
    it.skip("#arglist_", function() {
    });
    it.skip("#next", function() {
    });
    it.skip("#reset", function() {
    });
    it.skip("#storeOn", function() {
    });
  });

})();
