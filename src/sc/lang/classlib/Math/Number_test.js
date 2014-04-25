"use strict";

require("./Number");

var $SC = sc.lang.$SC;
var iterator = sc.lang.iterator;

describe("SCNumber", function() {
  var SCNumber;
  before(function() {
    SCNumber = $SC.Class("Number");
    this.createInstance = function(value) {
      var instance = $SC.Float(typeof value === "undefined" ? 0 : value);
      var testMethod = this.test.title.substr(1);
      sc.test.setSingletonMethod(instance, "Number", testMethod);
      return instance;
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
    expect(function() {
      instance["+"]();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#-", function() {
    var instance = this.createInstance();
    expect(function() {
      instance["-"]();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#*", function() {
    var instance = this.createInstance();
    expect(function() {
      instance["*"]();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#/", function() {
    var instance = this.createInstance();
    expect(function() {
      instance["/"]();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#mod", function() {
    var instance = this.createInstance();
    expect(function() {
      instance.mod();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#div", function() {
    var instance = this.createInstance();
    expect(function() {
      instance.div();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#pow", function() {
    var instance = this.createInstance();
    expect(function() {
      instance.pow();
    }).to.throw(Error, "should have been implemented by subclass");
  });
  it("#performBinaryOpOnSeqColl", sinon.test(function() {
    var instance, test;
    var $elem, $aSelector, $aSeqColl, $adverb;

    $elem = sc.test.object({
      perform: this.spy(sc.test.func)
    });
    $aSelector = sc.test.object();
    $aSeqColl = sc.test.object({
      collect: function($func) {
        return $func.value($elem);
      }
    });
    $adverb = sc.test.object();

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
    $endValue = sc.test.object();
    $function = sc.test.object();
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
    $endValue  = sc.test.object();
    $stepValue = sc.test.object();
    $function  = sc.test.object();

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
    $second   = sc.test.object();
    $last     = sc.test.object();
    $function = sc.test.object();

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
