describe("sc.lang.compiler.marker", function() {
  "use strict";

  var Marker = sc.lang.compiler.Marker;

  function Lexer(opts) {
    this.opts = opts || {};
    this.i = 0;
  }

  Lexer.prototype.skipComment = function() {
  };

  Lexer.prototype.getLocItems = function() {
    return [ this.i++, this.i++, this.i++ ];
  };

  it("mark with updated location", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.update().apply({ type: "node" });

    expect(node).to.deep.equal({
      type: "node",
      range: [ 0, 3 ],
      loc: {
        start: { line: 1, column: 2 },
        end: { line: 4, column: 5 },
      }
    });
  });

  it("mark without updated location", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.apply({ type: "node" });

    expect(node).to.deep.equal({
      type: "node",
      range: [ 0, 0 ],
      loc: {
        start: { line: 1, column: 2 },
        end: { line: 1, column: 2 },
      }
    });
  });

  it("create a marker that applied start location when receive node", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer, {
      range: [ 100, 103 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 104, column: 105 },
      }
    });
    var node = marker.update().apply({ type: "node" });

    expect(node).to.deep.equal({
      type: "node",
      range: [ 100, 0 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 1, column: 2 },
      }
    });
  });

  it("update a marker that applied end location when receive node", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.update({
      range: [ 100, 103 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 104, column: 105 },
      }
    }).apply({ type: "node" });

    expect(node).to.deep.equal({
      type: "node",
      range: [ 0, 103 ],
      loc: {
        start: { line: 1, column: 2 },
        end: { line: 104, column: 105 },
      }
    });
  });

  it("not update when location exists already", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.update().apply({
      type: "node",
      range: [ 100, 103 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 104, column: 105 },
      }
    });

    expect(node).to.deep.equal({
      type: "node",
      range: [ 100, 103 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 104, column: 105 },
      }
    });
  });

  it("if 2nd argument is true, update regardless when location exists", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.update().apply({
      type: "node",
      range: [ 100, 103 ],
      loc: {
        start: { line: 101, column: 102 },
        end: { line: 104, column: 105 },
      }
    }, true);

    expect(node).to.deep.equal({
      type: "node",
      range: [ 0, 3 ],
      loc: {
        start: { line: 1, column: 2 },
        end: { line: 4, column: 5 },
      }
    });
  });

  it("ignore when receive an array", function() {
    var lexer  = new Lexer({ range: true, loc: true });
    var marker = Marker.create(lexer);
    var node = marker.update().apply([ 1, 2, 3 ]);

    expect(node).to.deep.equal([ 1, 2, 3 ]);
  });

  it("should no operate when options are false", function() {
    var lexer  = new Lexer({ range: false, loc: false });
    var marker = Marker.create(lexer);
    var node = marker.update().apply({ type: "node" });

    expect(node).to.deep.equal({ type: "node" });
  });
});
