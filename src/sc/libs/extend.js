(function(sc) {
  "use strict";

  require("./sc");

  var extend = function(child, parent) {
    var ctor = function() {
      this.constructor = child;
    };
    ctor.prototype = parent.prototype;
    /* jshint newcap: false */
    child.prototype = new ctor();
    /* jshint newcap: true */
    return child;
  };

  sc.libs.extend = extend;
})(sc);
