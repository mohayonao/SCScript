(function() {
  "use strict";

  require("./Environment");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  describe("SCEnvironment", function() {
    var SCEnvironment;
    before(function() {
      SCEnvironment = $("Environment");
      this.createInstance = function(list) {
        return SCEnvironment.newFrom($$(list || []));
      };
    });
    it("#valueOf", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.valueOf();
      expect(test).to.be.a("JSObject").that.eqls({});
    });
    it("#eventAt", function() {
      var instance, test;

      instance = this.createInstance([ 1, 2, 3, 4 ]);
      test = instance.eventAt($$(1));

      expect(test).to.be.a("SCInteger").equals(2);
    });
    it("#composeEvents", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.composeEvents($$([ 1, 2, 3, 4 ]));

      expect(test).to.not.equal(instance);
      expect(test).to.be.a("SCEnvironment").that.eqls({ 1: 2, 3: 4 });
    });
    it.skip("#linkDoc", function() {
    });
    it.skip("#unlinkDoc", function() {
    });
    it("push/pop", sc.test(function() {
      var test;

      $.Environment("a", $$(1));
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);

      SCEnvironment.new().push();
      $.Environment("a", $$(2));
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(2);

      SCEnvironment.new().pop();
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);

      SCEnvironment.new().pop();
    }));
    it("make", sc.test(function() {
      var test;
      var $function;

      $.Environment("a", $$(1));
      $function = $$(function() {
        $.Environment("a", $$(100));
        return $.Environment("a").neg();
      });

      test = SCEnvironment.make($function);
      expect(test).to.be.a("SCEnvironment").that.eqls({ a: 100 });

      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    }));
    it("use", sc.test(function() {
      var test;
      var $function;

      $.Environment("a", $$(1));
      $function = $$(function() {
        $.Environment("a", $$(100));
        return $.Environment("a").neg();
      });

      test = SCEnvironment.use($function);
      expect(test).to.be.a("SCInteger").that.equals(-100);

      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    }));
  });
})();
