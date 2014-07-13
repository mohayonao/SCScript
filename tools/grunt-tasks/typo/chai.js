module.exports = function(context) {
  "use strict";

  var _ = require("underscore");

  var wellKnowns = [
    // chai
    "ok",
    "true",
    "false",
    "null",
    "undefined",
    "exist",
    "empty",
    "arguments",

    // sinon-chai
    "called",
    "calledOnce",
    "calledTwice",
    "calledThrice",
    "calledWithNew",
    "alwaysCalledWithNew",

    // custom
    "doNothing",
    "NaN"
  ];

  return {
    ExpressionStatement: function(node) {
      if (!/_test\.js/.test(context.filename)) {
        return;
      }
      if (node.expression.type !== "MemberExpression") {
        return;
      }
      if (_.contains(wellKnowns, node.expression.property.name)) {
        return;
      }
      context.report(
        node.expression.property, String.format("invalid assertion")
      );
    }
  };
};
