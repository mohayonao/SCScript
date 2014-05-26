(function() {
  "use strict";

  require("./BasicOpsStream");

  var $ = sc.lang.$;

  describe("SCUnaryOpStream", function() {
    var SCUnaryOpStream;
    before(function() {
      SCUnaryOpStream = $("UnaryOpStream");
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
      SCBinaryOpStream = $("BinaryOpStream");
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
      SCBinaryOpXStream = $("BinaryOpXStream");
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
      SCNAryOpStream = $("NAryOpStream");
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
