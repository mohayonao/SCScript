(function() {
  "use strict";

  require("./ListPatterns");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  var SCListPattern = $("ListPattern");
  var SCPseq = $("Pseq");

  describe("SCListPattern", function() {
    before(function() {
      this.createInstance = function(list, repeats) {
        return SCListPattern.new($$(list || [ 1, 2, 3 ]), $$(repeats || 1));
      };
    });
    it(".new", function() {
      var $empty = $$([]);
      expect(function() {
        SCListPattern.new($empty);
      }).to.throw("ListPattern (ListPattern) requires a non-empty collection");
    });
    it("#copy", function() {
      var instance, test;
      var $list = $$([ 1, 2, 3, 4, 5 ]);

      instance = this.createInstance($list);

      test = instance.copy();
      expect(test).to.be.a("SCListPattern").that.not.equals(instance);
      expect(test.list()).to.not.equals(instance.list());
      expect(test.list().valueOf()).to.deep.equal(instance.list().valueOf());
    });
    it.skip("#storeArgs", function() {
    });
  });

  describe("SCPseq", function() {
    before(function() {
      this.createInstance = function(list, repeats, offset) {
        return SCPseq.new($$(list || [ 1, 2, 3 ]), $$(repeats || 1), $$(offset || 0));
      };
    });
    it("#asStream", function() {
      var r = this.createInstance([ 10, 20, 30 ], 2, 1).asStream();
      expect(r.next(), 1).to.be.a("SCInteger").that.equals(20);
      expect(r.next(), 2).to.be.a("SCInteger").that.equals(30);
      expect(r.next(), 3).to.be.a("SCInteger").that.equals(10);
      expect(r.next(), 4).to.be.a("SCInteger").that.equals(20);
      expect(r.next(), 5).to.be.a("SCInteger").that.equals(30);
      expect(r.next(), 6).to.be.a("SCInteger").that.equals(10);
      expect(r.next(), 7).to.be.a("SCNil");
    });
    it.skip("#storeArgs", function() {
    });
  });
})();
