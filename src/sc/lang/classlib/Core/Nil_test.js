"use strict";

require("./Nil");

var $SC = sc.lang.$SC;

describe("SCNil", function() {
  var SCNil;
  before(function() {
    SCNil = $SC.Class("Nil");
    this.createInstance = function() {
      return $SC.Nil();
    };
  });
  it("#__num__", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.__num__();
    expect(test).to.be.a("JSNumber").that.equals(0);
  });
  it("#__bool__", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.__bool__();
    expect(test).to.be.a("JSBoolean").that.is.false;
  });
  it("#__sym__", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.__sym__();
    expect(test).to.be.a("JSString").that.equals("nil");
  });
  it("#toString", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.toString();
    expect(test).to.be.a("JSString").that.equals("nil");
  });
  it(".new", function() {
    expect(function() {
      SCNil.new();
    }).to.throw("should use literal");
  });
  it("#isNil", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.isNil();
    expect(test).to.be.a("SCBoolean").that.is.true;
  });
  it("#notNil", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.notNil();
    expect(test).to.be.a("SCBoolean").that.is.false;
  });
  it("#?", function() {
    var instance, test;
    var $obj;

    $obj = sc.test.object();

    instance = this.createInstance();

    test = instance ["?"] ($obj);
    expect(test).to.equal($obj);
  });
  it("#??", function() {
    var instance, test;
    var $obj;

    $obj = sc.test.object({
      value: sc.test.func
    });

    instance = this.createInstance();

    test = instance ["??"] ($obj);
    expect($obj.value).to.be.calledLastIn(test);
  });
  it("#!?", function() {
    var instance = this.createInstance();
    expect(instance["!?"]).to.be.nop;
  });
  it("#asBoolean", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.asBoolean();
    expect(test).to.be.a("SCBoolean").that.is.false;
  });
  it("#booleanValue", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.booleanValue();
    expect(test).to.be.a("SCBoolean").that.is.false;
  });
  it("#push", function() {
    var instance, test;
    var $function;

    $function = sc.test.object({
      value: sc.test.func
    });

    instance = this.createInstance();

    test = instance.push($function);
    expect($function.value).to.be.calledLastIn(test);
  });
  it("#appendStream", function() {
    var instance, test;
    var $stream;

    $stream = sc.test.object();

    instance = this.createInstance();

    test = instance.appendStream($stream);
    expect(test).to.equal($stream);
  });
  it("#pop", function() {
    var instance = this.createInstance();
    expect(instance.pop).to.be.nop;
  });
  it("#source", function() {
    var instance = this.createInstance();
    expect(instance.source).to.be.nop;
  });
  it("#source_", function() {
    var instance = this.createInstance();
    expect(instance.source_).to.be.nop;
  });
  it("#rate", function() {
    var instance = this.createInstance();
    expect(instance.rate).to.be.nop;
  });
  it("#numChannels", function() {
    var instance = this.createInstance();
    expect(instance.numChannels).to.be.nop;
  });
  it("#isPlaying", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.isPlaying();
    expect(test).to.be.a("SCBoolean").that.is.false;
  });
  it("#do", function() {
    var instance = this.createInstance();
    expect(instance.do).to.be.nop;
  });
  it("#reverseDo", function() {
    var instance = this.createInstance();
    expect(instance.reverseDo).to.be.nop;
  });
  it("#pairsDo", function() {
    var instance = this.createInstance();
    expect(instance.pairsDo).to.be.nop;
  });
  it("#collect", function() {
    var instance = this.createInstance();
    expect(instance.collect).to.be.nop;
  });
  it("#select", function() {
    var instance = this.createInstance();
    expect(instance.select).to.be.nop;
  });
  it("#reject", function() {
    var instance = this.createInstance();
    expect(instance.reject).to.be.nop;
  });
  it("#detect", function() {
    var instance = this.createInstance();
    expect(instance.detect).to.be.nop;
  });
  it("#collectAs", function() {
    var instance = this.createInstance();
    expect(instance.collectAs).to.be.nop;
  });
  it("#selectAs", function() {
    var instance = this.createInstance();
    expect(instance.selectAs).to.be.nop;
  });
  it("#rejectAs", function() {
    var instance = this.createInstance();
    expect(instance.rejectAs).to.be.nop;
  });
  it("#dependants", sinon.test(function() {
    var instance, test, spy;

    spy = this.spy(sc.test.func);
    this.stub($SC, "Class").withArgs("IdentitySet").returns(sc.test.object({
      new: spy
    }));

    instance = this.createInstance();

    test = instance.dependants();
    expect(spy).to.be.calledLastIn(test);
  }));
  it("#changed", function() {
    var instance = this.createInstance();
    expect(instance.changed).to.be.nop;
  });
  it("#addDependant", function() {
    var instance = this.createInstance();
    expect(instance.addDependant).to.be.nop;
  });
  it("#removeDependant", function() {
    var instance = this.createInstance();
    expect(instance.removeDependant).to.be.nop;
  });
  it("#release", function() {
    var instance = this.createInstance();
    expect(instance.release).to.be.nop;
  });
  it("#update", function() {
    var instance = this.createInstance();
    expect(instance.update).to.be.nop;
  });
  it("#transformEvent", function() {
    var instance, test;
    var $event;

    $event = sc.test.object();

    instance = this.createInstance();

    test = instance.transformEvent($event);
    expect(test).to.equal($event);
  });
  it("#awake", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.awake();
    expect(test).to.be.a("SCNil");
  });
  it("#play", function() {
    var instance = this.createInstance();
    expect(instance.play).to.be.nop;
  });
  it("#nextTimeOnGrid", sinon.test(function() {
    var instance, test;
    var $clock;

    $clock = $SC.Nil();

    instance = this.createInstance();

    test = instance.nextTimeOnGrid($clock);
    expect(test).to.be.a("SCNil");

    $clock = sc.test.object();
    $clock.nextTimeOnGrid = this.spy(sc.test.func);

    test = instance.nextTimeOnGrid($clock);
    expect(test).to.be.a("SCFunction");
    expect($clock.nextTimeOnGrid).to.be.not.called;

    test = test.value();
    expect($clock.nextTimeOnGrid).to.be.calledLastIn(test);
  }));
  it("#asQuant", sinon.test(function() {
    var instance, test, spy;

    spy = this.spy(sc.test.func);
    this.stub($SC, "Class").withArgs("Quant").returns(sc.test.object({
      "default": spy
    }));

    instance = this.createInstance();

    test = instance.asQuant();
    expect(spy).to.be.calledLastIn(test);
  }));
  it("#swapThisGroup", function() {
    var instance = this.createInstance();
    expect(instance.swapThisGroup).to.be.nop;
  });
  it("#performMsg", function() {
    var instance = this.createInstance();
    expect(instance.swapThisGroup).to.be.nop;
  });
  it("printOn", sinon.test(function() {
    var instance, test;
    var $stream;

    $stream = sc.test.object({
      putAll: this.spy()
    });

    instance = this.createInstance();

    test = instance.printOn($stream);
    expect($stream.putAll.args[0][0]).to.be.a("SCString").that.equals("nil");
    expect(test).to.equal(instance);
  }));
  it("storeOn", sinon.test(function() {
    var instance, test;
    var $stream;

    $stream = sc.test.object({
      putAll: this.spy()
    });

    instance = this.createInstance();

    test = instance.storeOn($stream);
    expect($stream.putAll.args[0][0]).to.be.a("SCString").that.equals("nil");
    expect(test).to.equal(instance);
  }));
  it("#matchItem", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.matchItem();
    expect(test).to.be.a("SCBoolean").that.is.true;
  });
  it("#add", function() {
    var instance, test;
    var $value;

    $value = sc.test.object();

    instance = this.createInstance();

    test = instance.add($value);
    expect(test).to.be.a("SCArray").that.eql([ $value ]);
  });
  it("#addAll", function() {
    var instance, test;
    var $array;

    $array = sc.test.object();

    instance = this.createInstance();

    test = instance.addAll($array);
    expect(test).to.be.a("SCArray").that.eql([ $array ]);
  });
  it("#++", function() {
    var instance, test;
    var $array;

    $array = sc.test.object();

    instance = this.createInstance();

    test = instance ["++"] ($array);
    expect(test).to.be.a("SCArray").that.eql([ $array ]);
  });
  it("#asCollection", function() {
    var instance, test;

    instance = this.createInstance();

    test = instance.asCollection();
    expect(test).to.be.a("SCArray").that.eql([]);
  });
  it("#remove", function() {
    var instance = this.createInstance();
    expect(instance.remove).to.be.nop;
  });
  it("#set", function() {
    var instance = this.createInstance();
    expect(instance.set).to.be.nop;
  });
  it("#get", function() {
    var instance, test;
    var $prevVal;

    $prevVal = sc.test.object();

    instance = this.createInstance();

    test = instance.get($prevVal);
    expect(test).to.equal($prevVal);
  });
  it("#addFunc", sinon.test(function() {
    var instance, test, stub;
    var $arg1, $arg2, $arg3;

    stub = this.stub($SC, "Class");
    stub.withArgs("FunctionList").returns(sc.test.object({
      new: function(arg) {
        return arg;
      }
    }));
    $arg1 = sc.test.object();
    $arg2 = sc.test.object();
    $arg3 = sc.test.object();

    instance = this.createInstance();
    test = instance.addFunc($arg1);
    expect(stub).to.be.not.called;
    expect(test).to.equal($arg1);

    instance = this.createInstance();
    test = instance.addFunc($arg1, $arg2, $arg3);
    expect(stub).to.be.called;
    expect(test).to.be.a("SCArray").that.eql([ $arg1, $arg2, $arg3 ]);
  }));
  it("#removeFunc", function() {
    var instance = this.createInstance();
    expect(instance.removeFunc).to.be.nop;
  });
  it("#replaceFunc", function() {
    var instance = this.createInstance();
    expect(instance.replaceFunc).to.be.nop;
  });
  it("#seconds_", function() {
    var instance = this.createInstance();
    expect(instance.seconds_).to.be.nop;
  });
  it("#throw", function() {
    var instance = this.createInstance();
    expect(instance.throw).to.be.nop;
  });
  it.skip("#handleError", function() {
  });
  it("#archiveAsCompileString", function() {
    var instance, test;

    instance = this.createInstance();
    test = instance.archiveAsCompileString();
    expect(test).to.be.a("SCBoolean").that.is.true;
  });
  it("#asSpec", sinon.test(function() {
    var instance, test, spy, stub;

    spy = this.spy(sc.test.func);
    stub = this.stub($SC, "Class");
    stub.withArgs("ControlSpec").returns(sc.test.object({
      new: spy
    }));

    instance = this.createInstance();

    test = instance.asSpec();
    expect(stub.getCall(0)).to.be.calledWith("ControlSpec");
    expect(spy).to.be.calledLastIn(test);
  }));
  it("#superclassesDo", function() {
    var instance = this.createInstance();
    expect(instance.superclassesDo).to.be.nop;
  });
  it("#shallowCopy", function() {
    var instance = this.createInstance();
    expect(instance.shallowCopy).to.be.nop;
  });
});
