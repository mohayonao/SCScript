(function(sc) {
  "use strict";

  require("./sc");

  var strlib = {};

  strlib.quote = function(str) {
    return "'" + String(str) + "'";
  };

  strlib.article = function(name) {
    if (/^[AEIOU]/i.test(name)) {
      return "an";
    }
    return "a";
  };

  strlib.methodIdentifier = function(className, methodName, isClassMethod) {
    return className + (isClassMethod ? "." : "#") + methodName;
  };

  sc.libs.strlib = strlib;
})(sc);
