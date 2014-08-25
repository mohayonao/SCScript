SCScript.install(function(sc) {
  "use strict";

  require("../Core/Object");

  sc.lang.klass.define("Node", function() {
    // TODO: implements $addActions
    // TODO: implements $initClass
    // TODO: implements $basicNew
    // TODO: implements $actionNumberFor
    // TODO: implements $setnMsgArgs
    // TODO: implements $orderNodesMsg
    // TODO: implements nodeID
    // TODO: implements nodeID_
    // TODO: implements server
    // TODO: implements server_
    // TODO: implements group
    // TODO: implements group_
    // TODO: implements isPlaying
    // TODO: implements isPlaying_
    // TODO: implements isRunning
    // TODO: implements isRunning_
    // TODO: implements free
    // TODO: implements freeMsg
    // TODO: implements run
    // TODO: implements runMsg
    // TODO: implements map
    // TODO: implements mapMsg
    // TODO: implements mapn
    // TODO: implements mapnMsg
    // TODO: implements set
    // TODO: implements setMsg
    // TODO: implements setn
    // TODO: implements setnMsg
    // TODO: implements fill
    // TODO: implements fillMsg
    // TODO: implements release
    // TODO: implements releaseMsg
    // TODO: implements trace
    // TODO: implements query
    // TODO: implements register
    // TODO: implements onFree
    // TODO: implements waitForFree
    // TODO: implements moveBefore
    // TODO: implements moveAfter
    // TODO: implements moveToHead
    // TODO: implements moveToTail
    // TODO: implements moveBeforeMsg
    // TODO: implements moveAfterMsg
    // TODO: implements moveToHeadMsg
    // TODO: implements moveToTailMsg
    // TODO: implements ==
    // TODO: implements hash
    // TODO: implements printOn
    // TODO: implements asUGenInput
    // TODO: implements asControlInput
    // TODO: implements asTarget
    // TODO: implements asNodeID
  });

  sc.lang.klass.define("AbstractGroup : Node", function() {
    // TODO: implements $new
    // TODO: implements $after
    // TODO: implements $before
    // TODO: implements $head
    // TODO: implements $tail
    // TODO: implements $replace
    // TODO: implements $creationCmd
    // TODO: implements newMsg
    // TODO: implements addToHeadMsg
    // TODO: implements addToTailMsg
    // TODO: implements addAfterMsg
    // TODO: implements addBeforeMsg
    // TODO: implements addReplaceMsg
    // TODO: implements moveNodeToHead
    // TODO: implements moveNodeToTail
    // TODO: implements moveNodeToHeadMsg
    // TODO: implements moveNodeToTailMsg
    // TODO: implements freeAll
    // TODO: implements freeAllMsg
    // TODO: implements deepFree
    // TODO: implements deepFreeMsg
    // TODO: implements dumpTree
    // TODO: implements queryTree
    // TODO: implements asGroup
  });

  sc.lang.klass.define("Group : AbstractGroup", function() {
    // TODO: implements $creationCmd
  });

  sc.lang.klass.define("Synth : Node", function() {
    // TODO: implements $new
    // TODO: implements $newPaused
    // TODO: implements $replace
    // TODO: implements $basicNew
    // TODO: implements $after
    // TODO: implements $before
    // TODO: implements $head
    // TODO: implements $tail
    // TODO: implements $grain
    // TODO: implements defName
    // TODO: implements defName_
    // TODO: implements newMsg
    // TODO: implements replace
    // TODO: implements addToHeadMsg
    // TODO: implements addToTailMsg
    // TODO: implements addAfterMsg
    // TODO: implements addBeforeMsg
    // TODO: implements addReplaceMsg
    // TODO: implements get
    // TODO: implements getMsg
    // TODO: implements getn
    // TODO: implements getnMsg
    // TODO: implements seti
    // TODO: implements printOn
    // TODO: implements asGroup
    // TODO: implements prepareForProxySynthDef
  });

});
