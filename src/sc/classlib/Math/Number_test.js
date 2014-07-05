(function() {
  "use strict";

  require("./Number");

  var $$ = sc.test.object;

  var $ = sc.lang.$;

  describe("SCNumber", function() {
    before(function() {
      this.createInstance = function(value) {
        var instance = $.Float(typeof value === "undefined" ? 0 : value);
        return $$(instance, "Number" + this.test.title);
      };
    });
    it("#isNumber", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.isNumber();
      expect(test).to.be.a("SCBoolean").that.equals(true);
    });
    it("#+", function() {
      var instance = this.createInstance();
      expect(instance["+"].__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#-", function() {
      var instance = this.createInstance();
      expect(instance["-"].__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#*", function() {
      var instance = this.createInstance();
      expect(instance["*"].__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#/", function() {
      var instance = this.createInstance();
      expect(instance["/"].__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#mod", function() {
      var instance = this.createInstance();
      expect(instance.mod.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#div", function() {
      var instance = this.createInstance();
      expect(instance.div.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#pow", function() {
      var instance = this.createInstance();
      expect(instance.pow.__errorType).to.equal(sc.ERRID_SUBCLASS_RESPONSIBILITY);
    });
    it("#performBinaryOpOnSeqColl", sinon.test(function() {
      var instance, test;
      var $elem = $$({ perform: this.spy(sc.test.func()) });
      var $aSelector = $$();
      var $aSeqColl = $$({
        collect: function($func) {
          return $func.value($elem);
        }
      });
      var $adverb = $$();

      instance = this.createInstance();

      test = instance.performBinaryOpOnSeqColl($aSelector, $aSeqColl, $adverb);
      expect($elem.perform).to.be.calledWith($aSelector, instance, $adverb);
      expect($elem.perform).to.be.calledLastIn(test);
    }));
    it.skip("#performBinaryOpOnPoint", function() {
    });
    it("#rho", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.rho).to.doNothing;
    });
    it("#theta", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.theta();
      expect(test).to.be.a("SCFloat").that.equal(0.0);
    });
    it("#real", function() {
      var instance;

      instance = this.createInstance();
      expect(instance.real).to.doNothing;
    });
    it("#imag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.imag();
      expect(test).to.be.a("SCFloat").that.equal(0.0);
    });
    it("#for", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $endValue = $$();
      var $function = $$();

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "number$for").returns(iter);
      this.stub(sc.lang.iterator, "execute");

      test = instance.for($endValue, $function);
      expect(sc.lang.iterator.number$for).to.be.calledWith(instance, $endValue);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#forBy", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $endValue  = $$();
      var $stepValue = $$();
      var $function  = $$();

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "number$forBy").returns(iter);
      this.stub(sc.lang.iterator, "execute");

      test = instance.forBy($endValue, $stepValue, $function);
      expect(sc.lang.iterator.number$forBy).to.be.calledWith(instance, $endValue, $stepValue);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#forSeries", sinon.test(function() {
      var instance, test;
      var iter = {};
      var $second   = $$();
      var $last     = $$();
      var $function = $$();

      instance = this.createInstance();
      this.stub(sc.lang.iterator, "number$forSeries").returns(iter);
      this.stub(sc.lang.iterator, "execute");

      test = instance.forSeries($second, $last, $function);
      expect(sc.lang.iterator.number$forSeries).to.be.calledWith(instance, $second, $last);
      expect(sc.lang.iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
  });
})();
