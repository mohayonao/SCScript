SCScript.install(function(sc) {
  "use strict";

  require("../Core/AbstractFunction");

  sc.lang.klass.define("UGen : AbstractFunction", function() {
    // TODO: implements $buildSynthDef
    // TODO: implements $buildSynthDef_
    // TODO: implements $new1
    // TODO: implements $newFromDesc
    // TODO: implements $multiNew
    // TODO: implements $multiNewList
    // TODO: implements $methodSelectorForRate
    // TODO: implements $replaceZeroesWithSilence
    // TODO: implements synthDef
    // TODO: implements synthDef_
    // TODO: implements inputs
    // TODO: implements inputs_
    // TODO: implements rate
    // TODO: implements rate_
    // TODO: implements synthIndex
    // TODO: implements synthIndex_
    // TODO: implements specialIndex
    // TODO: implements specialIndex_
    // TODO: implements antecedents
    // TODO: implements antecedents_
    // TODO: implements descendants
    // TODO: implements descendants_
    // TODO: implements widthFirstAntecedents
    // TODO: implements widthFirstAntecedents_
    // TODO: implements init
    // TODO: implements copy
    // TODO: implements madd
    // TODO: implements range
    // TODO: implements exprange
    // TODO: implements curverange
    // TODO: implements unipolar
    // TODO: implements bipolar
    // TODO: implements clip
    // TODO: implements fold
    // TODO: implements wrap
    // TODO: implements blend
    // TODO: implements minNyquist
    // TODO: implements lag
    // TODO: implements lag2
    // TODO: implements lag3
    // TODO: implements lagud
    // TODO: implements lag2ud
    // TODO: implements lag3ud
    // TODO: implements varlag
    // TODO: implements slew
    // TODO: implements prune
    // TODO: implements linlin
    // TODO: implements linexp
    // TODO: implements explin
    // TODO: implements expexp
    // TODO: implements lincurve
    // TODO: implements curvelin
    // TODO: implements bilin
    // TODO: implements moddif
    // TODO: implements signalRange
    // TODO: implements @
    // TODO: implements addToSynth
    // TODO: implements collectConstants
    // TODO: implements isValidUGenInput
    // TODO: implements asUGenInput
    // TODO: implements asControlInput
    // TODO: implements numChannels
    // TODO: implements checkInputs
    // TODO: implements checkValidInputs
    // TODO: implements checkNInputs
    // TODO: implements checkSameRateAsFirstInput
    // TODO: implements argNameForInputAt
    // TODO: implements argNamesInputsOffset
    // TODO: implements dumpArgs
    // TODO: implements degreeToKey
    // TODO: implements outputIndex
    // TODO: implements writesToBus
    // TODO: implements poll
    // TODO: implements dpoll
    // TODO: implements checkBadValues
    // TODO: implements composeUnaryOp
    // TODO: implements composeBinaryOp
    // TODO: implements reverseComposeBinaryOp
    // TODO: implements composeNAryOp
    // TODO: implements asComplex
    // TODO: implements performBinaryOpOnComplex
    // TODO: implements if
    // TODO: implements rateNumber
    // TODO: implements methodSelectorForRate
    // TODO: implements writeInputSpec
    // TODO: implements writeOutputSpec
    // TODO: implements writeOutputSpecs
    // TODO: implements numInputs
    // TODO: implements numOutputs
    // TODO: implements name
    // TODO: implements writeDef
    // TODO: implements initTopoSort
    // TODO: implements makeAvailable
    // TODO: implements removeAntecedent
    // TODO: implements schedule
    // TODO: implements optimizeGraph
    // TODO: implements dumpName
    // TODO: implements performDeadCodeElimination
    // TODO: implements writeDefOld
    // TODO: implements writeInputSpecOld
    // TODO: implements scope
  });

  sc.lang.klass.define("PureUGen : UGen", function() {
    // TODO: implements optimizeGraph
  });

  sc.lang.klass.define("MultiOutUGen : UGen", function() {
    // TODO: implements $newFromDesc
    // TODO: implements channels
    // TODO: implements initOutputs
    // TODO: implements numOutputs
    // TODO: implements writeOutputSpecs
    // TODO: implements synthIndex_
  });

  sc.lang.klass.define("PureMultiOutUGen : MultiOutUGen", function() {
    // TODO: implements optimizeGraph
  });

  sc.lang.klass.define("OutputProxy : UGen", function() {
    // TODO: implements $new
    // TODO: implements source
    // TODO: implements source_
    // TODO: implements outputIndex
    // TODO: implements outputIndex_
    // TODO: implements name
    // TODO: implements name_
    // TODO: implements addToSynth
    // TODO: implements init
    // TODO: implements dumpName
  });

});
