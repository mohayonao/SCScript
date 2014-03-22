(function(global) {
  "use strict";

  var C = {
    TAG_NOT_INITIALIZED: 0x00,
    TAG_OBJ: 0x01,
    TAG_INT: 0x02,
    TAG_SYM: 0x03,
    TAG_CHAR: 0x04,
    TAG_NIL: 0x05,
    TAG_FALSE: 0x06,
    TAG_TRUE: 0x07,
    TAG_PTR: 0x08,
    TAG_FLOAT: 0x09,
    TAG_STR: 0x0a,
    TAG_UNUSED: 0xff,
  };

  if (typeof global.sc !== "undefined") {
    global.sc.C = C;
  }
  if (typeof module !== "undefined") {
    module.exports = C;
  }

})(this.self||global);
