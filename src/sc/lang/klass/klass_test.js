(function() {
  "use strict";

  require("./klass");

  var klass = sc.lang.klass;

  describe("sc.lang.klass", function() {
    var klass$classes;
    before(function() {
      klass$classes = klass._classes;
    });
    beforeEach(function() {
      klass._classes = { Object: function() {} };
    });
    after(function() {
      klass._classes = klass$classes;
    });
    describe("get", function() {
      it("return defined class", function() {
        expect(klass.get("Object")).to.be.a("function");
      });
      it("throw error if try to get an undefined class", function() {
        expect(function() {
          klass.get("UndefinedClass");
        }).to.throw("Class not defined: UndefinedClass");
      });
    });
    describe("exists", function() {
      it("test whether or not the given class exists", function() {
        expect(klass.exists("Object")        , 0).to.be.a("JSBoolean").that.is.true;
        expect(klass.exists("UndefinedClass"), 1).to.be.a("JSBoolean").that.is.false;
      });
    });
  });
})();
