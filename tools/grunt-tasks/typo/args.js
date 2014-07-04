module.exports = function(context) {
  "use strict";

  function getArgumentDefinition(list) {
    for (var i = 0, imax = list.length; i < imax; ++i) {
      var node = list[i];
      if (node && node.type === "Property") {
        if (node.key.name === "args" && node.value.type === "Literal") {
          return node.value.value;
        }
      }
    }
    return null;
  }

  return {
    CallExpression: function(node) {
      if (node.callee.type !== "MemberExpression") {
        return;
      }
      if (node.callee.property.type !== "Identifier") {
        return;
      }
      if (!/^add(?:Class)?Method$/.test(node.callee.property.name)) {
        return;
      }
      if (node.arguments.length < 3) {
        return;
      }
      if (node.arguments[1].type !== "ObjectExpression") {
        return;
      }
      if (node.arguments[2].type !== "FunctionExpression") {
        return;
      }

      var args = getArgumentDefinition(node.arguments[1].properties);
      if (!args) {
        return;
      }

      var actual = node.arguments[2].params;
      var expected = args.split(";").map(function(x) {
        return "$" + x.split("=")[0].replace("*", "$").trim();
      });

      for (var i = 0, imax = Math.max(expected.length, actual.length); i < imax; ++i) {
        if (!actual[i]) {
          context.report(
            actual[i - 1], String.format("expect #{0}, but got None", expected[i])
          );
          break;
        }
        if (expected[i] !== actual[i].name) {
          context.report(
            actual[i], String.format("expect #{0}, but got #{1}", expected[i], actual[i].name)
          );
          break;
        }
      }
    }
  };
};
