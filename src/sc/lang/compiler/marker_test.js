(function() {
  "use strict";

  require("./marker");

  var Marker = sc.lang.compiler.marker;

  function Lexer(opts) {
    this.opts = opts || {};
    this.i = 0;
  }

  Lexer.prototype.skipComment = function() {
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.i++, this.i++, this.i++ ];
  };

  describe("sc.lang.compiler.marker", function() {
    it("mark with updated location", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = {};
      node = marker.update().apply(node);

      expect(node).to.eql({
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 4, column: 5 },
        }
      });
    });
    it("mark without updated location", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = {};
      node = marker.apply(node);

      expect(node).to.eql({
        range: [ 0, 0 ],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 1, column: 2 },
        }
      });
    });
    it("create a marker that applied start location when receive node", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });

      node = {
        range: [ 100, 103 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 104, column: 105 },
        }
      };

      marker = Marker.create(lexer, node);

      node = {};
      node = marker.update().apply(node);

      expect(node).to.eql({
        range: [ 100, 0 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 1, column: 2 },
        }
      });
    });
    it("update a marker that applied end location when receive node", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = {};
      node = marker.update({
        range: [ 100, 103 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 104, column: 105 },
        }
      }).apply(node);

      expect(node).to.eql({
        range: [ 0, 103 ],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 104, column: 105 },
        }
      });
    });
    it("not update when location exists already", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = {
        range: [ 100, 103 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 104, column: 105 },
        }
      };
      node = marker.update().apply(node);

      expect(node).to.eql({
        range: [ 100, 103 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 104, column: 105 },
        }
      });
    });
    it("if 2nd argument is true, update regardless when location exists", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = {
        range: [ 100, 103 ],
        loc: {
          start: { line: 101, column: 102 },
          end: { line: 104, column: 105 },
        }
      };
      node = marker.update().apply(node, true);

      expect(node).to.eql({
        range: [ 0, 3 ],
        loc: {
          start: { line: 1, column: 2 },
          end: { line: 4, column: 5 },
        }
      });
    });
    it("ignore when receive an array", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: true, loc: true });
      marker = Marker.create(lexer);

      node = [];
      node = marker.update().apply(node);

      expect(node).to.eql([]);
    });
    it("should no operate when options are false", function() {
      var lexer, marker, node;

      lexer  = new Lexer({ range: false, loc: false });
      marker = Marker.create(lexer);

      node = {};
      node = marker.update().apply(node);

      expect(node).to.eql({});
    });
  });
})();
