(function(sc) {
  "use strict";

  require("./sc");

  var $SC = function(msg, rcv, args) {
    var method;

    method = rcv[msg];
    if (method) {
      return method.apply(rcv, args);
    }

    throw new Error(String(rcv) + " cannot understand message '" + msg + "'");
  };

  /* istanbul ignore next */
  var shouldBeImplementedInClassLib = function() {};

  $SC.Class = shouldBeImplementedInClassLib;
  $SC.Integer = shouldBeImplementedInClassLib;
  $SC.Float = shouldBeImplementedInClassLib;
  $SC.Char = shouldBeImplementedInClassLib;
  $SC.Array = shouldBeImplementedInClassLib;
  $SC.String = shouldBeImplementedInClassLib;
  $SC.Dictionary = shouldBeImplementedInClassLib;
  $SC.Function = shouldBeImplementedInClassLib;
  $SC.Routine = shouldBeImplementedInClassLib;
  $SC.Ref = shouldBeImplementedInClassLib;
  $SC.Symbol = shouldBeImplementedInClassLib;
  $SC.Boolean = shouldBeImplementedInClassLib;
  $SC.True = shouldBeImplementedInClassLib;
  $SC.False = shouldBeImplementedInClassLib;
  $SC.Nil = shouldBeImplementedInClassLib;

  sc.lang.$SC = $SC;

})(sc);
