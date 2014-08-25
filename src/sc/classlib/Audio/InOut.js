SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");
  require("./UGen");

  sc.lang.klass.define("ControlName", function() {
    // TODO: implements $new
    // TODO: implements name
    // TODO: implements name_
    // TODO: implements index
    // TODO: implements index_
    // TODO: implements rate
    // TODO: implements rate_
    // TODO: implements defaultValue
    // TODO: implements defaultValue_
    // TODO: implements argNum
    // TODO: implements argNum_
    // TODO: implements lag
    // TODO: implements lag_
    // TODO: implements numChannels
    // TODO: implements printOn
  });

  sc.lang.klass.define("Control : MultiOutUGen", function() {
    // TODO: implements $names
    // TODO: implements $kr
    // TODO: implements $ir
    // TODO: implements $isControlUGen
    // TODO: implements values
    // TODO: implements init
  });

  sc.lang.klass.define("AudioControl : MultiOutUGen", function() {
    // TODO: implements $names
    // TODO: implements $ar
    // TODO: implements $isAudioControlUGen
    // TODO: implements $isControlUGen
    // TODO: implements values
    // TODO: implements init
  });

  sc.lang.klass.define("TrigControl : Control", function() {
  });

  sc.lang.klass.define("LagControl : Control", function() {
    // TODO: implements $kr
    // TODO: implements $ir
    // TODO: implements init
  });

  sc.lang.klass.define("AbstractIn : MultiOutUGen", function() {
    // TODO: implements $isInputUGen
  });

  sc.lang.klass.define("In : AbstractIn", function() {
    // TODO: implements $ar
    // TODO: implements $kr
    // TODO: implements init
  });

  sc.lang.klass.define("LocalIn : AbstractIn", function() {
    // TODO: implements $ar
    // TODO: implements $kr
    // TODO: implements init
  });

  sc.lang.klass.define("LagIn : AbstractIn", function() {
    // TODO: implements $kr
    // TODO: implements init
  });

  sc.lang.klass.define("InFeedback : AbstractIn", function() {
    // TODO: implements $ar
    // TODO: implements init
  });

  sc.lang.klass.define("InTrig : AbstractIn", function() {
    // TODO: implements $kr
    // TODO: implements init
  });

  sc.lang.klass.define("AbstractOut : UGen", function() {
    // TODO: implements $isOutputUGen
    // TODO: implements $numFixedArgs
    // TODO: implements numOutputs
    // TODO: implements writeOutputSpecs
    // TODO: implements checkInputs
    // TODO: implements numAudioChannels
    // TODO: implements writesToBus
  });

  sc.lang.klass.define("Out : AbstractOut", function() {
    // TODO: implements $ar
    // TODO: implements $kr
    // TODO: implements $numFixedArgs
    // TODO: implements writesToBus
  });

  sc.lang.klass.define("ReplaceOut : Out", function() {
  });

  sc.lang.klass.define("OffsetOut : Out", function() {
    // TODO: implements $kr
  });

  sc.lang.klass.define("LocalOut : Out", function() {
    // TODO: implements $ar
    // TODO: implements $kr
    // TODO: implements $numFixedArgs
    // TODO: implements writesToBus
  });

  sc.lang.klass.define("XOut : Out", function() {
    // TODO: implements $ar
    // TODO: implements $kr
    // TODO: implements $numFixedArgs
    // TODO: implements checkInputs
    // TODO: implements writesToBus
  });

});
