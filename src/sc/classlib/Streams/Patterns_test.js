(function() {
  "use strict";

  require("./Patterns");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  describe("SCPattern", function() {
    it.skip("#++", function() {
    });
    it.skip("#<>", function() {
    });
    it.skip("#play", function() {
    });
    it.skip("#asStream", function() {
    });
    it.skip("#iter", function() {
    });
    it.skip("#streamArg", function() {
    });
    it.skip("#asEventStreamPlayer", function() {
    });
    it.skip("#embedInStream", function() {
    });
    it.skip("#do", function() {
    });
    it.skip("#collect", function() {
    });
    it.skip("#select", function() {
    });
    it.skip("#reject", function() {
    });
    it.skip("#composeUnaryOp", function() {
    });
    it.skip("#composeBinaryOp", function() {
    });
    it.skip("#reverseComposeBinaryOp", function() {
    });
    it.skip("#composeNAryOp", function() {
    });
    it.skip("#mtranspose", function() {
    });
    it.skip("#ctranspose", function() {
    });
    it.skip("#gtranspose", function() {
    });
    it.skip("#detune", function() {
    });
    it.skip("#scaleDur", function() {
    });
    it.skip("#addDur", function() {
    });
    it.skip("#stretch", function() {
    });
    it.skip("#lag", function() {
    });
    it.skip("#legato", function() {
    });
    it.skip("#db", function() {
    });
    it.skip("#clump", function() {
    });
    it.skip("#flatten", function() {
    });
    it.skip("#repeat", function() {
    });
    it.skip("#keep", function() {
    });
    it.skip("#drop", function() {
    });
    it.skip("#stutter", function() {
    });
    it.skip("#finDur", function() {
    });
    it.skip("#fin", function() {
    });
    it.skip("#trace", function() {
    });
    it.skip("#differentiate", function() {
    });
    it.skip("#integrate", function() {
    });
    it.skip("#record", function() {
    });
  });

  describe("SCPseries", function() {
    var SCPseries;
    before(function() {
      SCPseries = $("Pseries");
      this.createInstance = function(start, step, length) {
        return SCPseries.new($$(start || 0), $$(step || 1), $$(length || Infinity));
      };
    });
    it("#asStream", function() {
      var r = this.createInstance(100, 10, 5).asStream();
      expect(r.next(), 0).to.be.a("SCInteger").that.equals(100);
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(110);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(120);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(130);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(140);
      expect(r.next(), 5).to.be.a("SCNil");
    });
    it("#asStream break", function() {
      var r = this.createInstance(100, $$(null)).asStream();
      expect(r.next(), 0).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

  describe("SCPgeom", function() {
    var SCPgeom;
    before(function() {
      SCPgeom = $("Pgeom");
      this.createInstance = function(start, grow, length) {
        return SCPgeom.new($$(start || 0), $$(grow || 1), $$(length || Infinity));
      };
    });
    it("#asStream", function() {
      var r = this.createInstance(1, 256, 5).asStream();
      expect(r.next(), 0).to.be.a("SCInteger").that.equals(1);
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(256);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(65536);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(16777216);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(0); // overflow
      expect(r.next(), 5).to.be.a("SCNil");
    });
    it("#asStream break", function() {
      var r = this.createInstance(1, $$(null)).asStream();
      expect(r.next(), 0).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });

})();
