module.exports = function(context) {
  "use strict";

  var constVariables = require("../../../src/const");

  return {
    MemberExpression: function(node) {
      if (node.object.type !== "Identifier") {
        return;
      }
      if (node.property.type !== "Identifier") {
        return;
      }
      if (node.object.name !== "sc") {
        return;
      }
      if (node.property.name === "VERSION") {
        return;
      }
      if (!/^[A-Z0-9_]+$/.test(node.property.name)) {
        return;
      }
      if (!constVariables.hasOwnProperty(node.property.name)) {
        context.report(
          node.property, String.format("#{0} is not defined.", node.property.name)
        );
      }
    }
  };
};
