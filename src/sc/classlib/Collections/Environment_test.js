(function() {
  "use strict";

  require("./Environment");

  var $ = sc.lang.$;

  describe("SCEnvironment", function() {
    var SCEnvironment;
    before(function() {
      SCEnvironment = $("Environment");
      this.createInstance = function(list) {
        return SCEnvironment.newFrom(list ? sc.test.encode(list) : $.Array());
      };
      SCEnvironment.push(SCEnvironment.new());
    });
    after(function() {
      SCEnvironment.pop().pop();
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
      test = instance.eventAt($.Integer(1));

      expect(test).to.be.a("SCInteger").equals(2);
    });
    it("#composeEvents", function() {
      var instance, test;

      instance = this.createInstance();
      test = instance.composeEvents(sc.test.encode([ 1, 2, 3, 4 ]));

      expect(test).to.not.equal(instance);
      expect(test).to.be.a("SCEnvironment").that.eqls({ 1: 2, 3: 4 });
    });
    it.skip("#linkDoc", function() {
    });
    it.skip("#unlinkDoc", function() {
    });
    it("push/pop", function() {
      var test;

      $.Environment("a", $.Integer(1));
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);

      SCEnvironment.new().push();
      $.Environment("a", $.Integer(2));
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(2);

      SCEnvironment.new().pop();
      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("make", function() {
      var test;
      var $function;

      $.Environment("a", $.Integer(1));
      $function = $.Function(function() {
        $.Environment("a", $.Integer(100));
        return $.Environment("a").neg();
      });

      test = SCEnvironment.make($function);
      expect(test).to.be.a("SCEnvironment").that.eqls({ a: 100 });

      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
    it("use", function() {
      var test;
      var $function;

      $.Environment("a", $.Integer(1));
      $function = $.Function(function() {
        $.Environment("a", $.Integer(100));
        return $.Environment("a").neg();
      });

      test = SCEnvironment.use($function);
      expect(test).to.be.a("SCInteger").that.equals(-100);

      test = $.Environment("a");
      expect(test).to.be.a("SCInteger").that.equals(1);
    });
  });
})();
