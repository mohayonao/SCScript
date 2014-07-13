describe("sc.lang.klass", function() {
  "use strict";

  describe("get", function() {
    it("return defined class", function() {
      expect(sc.lang.klass.get("Object")).to.be.not.empty;
    });

    it("throw error if try to get an undefined class", function() {
      expect(function() {
        sc.lang.klass.get("UndefinedClass");
      }).to.throw("Class not defined: UndefinedClass");
    });
  });

  describe("exists", function() {
    it("test whether or not the given class exists", function() {
      expect(sc.lang.klass.exists("Object")        , 0).to.be.a("JSBoolean").that.is.true;
      expect(sc.lang.klass.exists("UndefinedClass"), 1).to.be.a("JSBoolean").that.is.false;
    });
  });

});
