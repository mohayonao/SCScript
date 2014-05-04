(function(sc) {
  "use strict";

  require("./compiler");

  function Marker(lexer, locItems) {
    this.lexer = lexer;
    this.startLocItems = locItems;
    this.endLocItems   = null;
  }

  Marker.create = function(lexer, node) {
    var locItems;

    if (!lexer.opts.loc && !lexer.opts.range) {
      return nopMarker;
    }

    if (node) {
      locItems = [ node.range[0], node.loc.start.line, node.loc.start.column ];
    } else {
      lexer.skipComment();
      locItems = lexer.getLocItems();
    }

    return new Marker(lexer, locItems);
  };

  Marker.prototype.update = function(node) {
    var locItems;

    if (node) {
      locItems = [ node.range[1], node.loc.end.line, node.loc.end.column ];
    } else {
      locItems = this.lexer.getLocItems();
    }
    this.endLocItems = locItems;

    return this;
  };

  Marker.prototype.apply = function(node, force) {
    var startLocItems, endLocItems;

    if (Array.isArray(node)) {
      return node;
    }

    if (force || !node.range || !node.loc) {
      startLocItems = this.startLocItems;
      if (this.endLocItems) {
        endLocItems = this.endLocItems;
      } else {
        endLocItems = this.startLocItems;
      }
      /* istanbul ignore else */
      if (this.lexer.opts.range) {
        node.range = [ startLocItems[0], endLocItems[0] ];
      }
      /* istanbul ignore else */
      if (this.lexer.opts.loc) {
        node.loc = {
          start: {
            line  : startLocItems[1],
            column: startLocItems[2]
          },
          end: {
            line  : endLocItems[1],
            column: endLocItems[2]
          }
        };
      }
    }

    return node;
  };

  var nopMarker = {
    apply: function(node) {
      return node;
    },
    update: function() {
      return this;
    }
  };

  sc.lang.compiler.marker = Marker;

})(sc);
