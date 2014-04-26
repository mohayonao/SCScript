(function(sc) {
  "use strict";

  require("../../classlib");

  var $SC = sc.lang.$SC;
  var mathlib = sc.libs.mathlib;

  sc.lang.classlib.bop = function(selector, type1, type2) {
    var func = mathlib[selector];

    return function($aNumber, $adverb) {
      var tag = $aNumber.__tag;

      switch (tag) {
      case sc.C.TAG_INT:
        return type1(func(this._, $aNumber._));
      case sc.C.TAG_FLOAT:
        return type2(func(this._, $aNumber._));
      }

      return $aNumber.performBinaryOpOnSimpleNumber(
        $SC.Symbol(selector), this, $adverb
      );
    };
  };

})(sc);
