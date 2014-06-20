(function() {
  "use strict";

  require("./Number");

  var $$ = sc.test.object;

  var $ = sc.lang.$;
  var iterator = sc.lang.iterator;

  describe("SCNumber", function() {
    var SCNumber;
    before(function() {
      SCNumber = $("Number");
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
      expect(instance["+"].__errorType).to.equal("subclassResponsibility");
    });
    it("#-", function() {
      var instance = this.createInstance();
      expect(instance["-"].__errorType).to.equal("subclassResponsibility");
    });
    it("#*", function() {
      var instance = this.createInstance();
      expect(instance["*"].__errorType).to.equal("subclassResponsibility");
    });
    it("#/", function() {
      var instance = this.createInstance();
      expect(instance["/"].__errorType).to.equal("subclassResponsibility");
    });
    it("#mod", function() {
      var instance = this.createInstance();
      expect(instance.mod.__errorType).to.equal("subclassResponsibility");
    });
    it("#div", function() {
      var instance = this.createInstance();
      expect(instance.div.__errorType).to.equal("subclassResponsibility");
    });
    it("#pow", function() {
      var instance = this.createInstance();
      expect(instance.pow.__errorType).to.equal("subclassResponsibility");
    });
    it("#performBinaryOpOnSeqColl", sinon.test(function() {
      var instance, test;
      var $elem, $aSelector, $aSeqColl, $adverb;

      $elem = $$({
        perform: this.spy(sc.test.func())
      });
      $aSelector = $$();
      $aSeqColl = $$({
        collect: function($func) {
          return $func.value($elem);
        }
      });
      $adverb = $$();

      instance = this.createInstance();

      test = instance.performBinaryOpOnSeqColl($aSelector, $aSeqColl, $adverb);
      expect($elem.perform).to.be.calledWith($aSelector, instance, $adverb);
      expect($elem.perform).to.be.calledLastIn(test);
    }));
    it.skip("#performBinaryOpOnPoint", function() {
    });
    it("#rho", function() {
      var instance = this.createInstance();
      expect(instance.rho).to.be.nop;
    });
    it("#theta", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.theta();
      expect(test).to.be.a("SCFloat").that.equal(0.0);
    });
    it("#real", function() {
      var instance = this.createInstance();
      expect(instance.real).to.be.nop;
    });
    it("#imag", function() {
      var instance, test;

      instance = this.createInstance();

      test = instance.imag();
      expect(test).to.be.a("SCFloat").that.equal(0.0);
    });
    it("#for", sinon.test(function() {
      var instance, test, iter;
      var $endValue, $function;

      iter = {};
      $endValue = $$();
      $function = $$();
      this.stub(iterator, "number$for", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.for($endValue, $function);
      expect(iterator.number$for).to.be.calledWith(instance, $endValue);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#forBy", sinon.test(function() {
      var instance, test, iter = {};
      var $endValue, $stepValue, $function;

      iter = {};
      $endValue  = $$();
      $stepValue = $$();
      $function  = $$();

      this.stub(iterator, "number$forBy", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.forBy($endValue, $stepValue, $function);
      expect(iterator.number$forBy).to.be.calledWith(instance, $endValue, $stepValue);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
    it("#forSeries", sinon.test(function() {
      var instance, test, iter;
      var $second, $last, $function;

      iter = {};
      $second   = $$();
      $last     = $$();
      $function = $$();

      this.stub(iterator, "number$forSeries", function() {
        return iter;
      });
      this.stub(iterator, "execute");

      instance = this.createInstance();

      test = instance.forSeries($second, $last, $function);
      expect(iterator.number$forSeries).to.be.calledWith(instance, $second, $last);
      expect(iterator.execute).to.be.calledWith(iter, $function);
      expect(test).to.equal(instance);
    }));
  });
})();
