(function(global) {
  "use strict";

  var TYPE_NUM  = 0x100;
  var TYPE_BOOL = 0x200;
  var TYPE_STR  = 0x400;
  var TYPE_SIG  = 0x800;

  var C = {
    TYPE_NUM : TYPE_NUM,
    TYPE_BOOL: TYPE_BOOL,
    TYPE_STR : TYPE_STR,
    TYPE_SIG : TYPE_SIG,

    TAG_NOT_INITIALIZED: 0x00,
    TAG_OBJ            : 0x01,
    TAG_INT            : 0x02            | TYPE_BOOL | TYPE_NUM,
    TAG_SYM            : 0x03 | TYPE_STR,
    TAG_CHAR           : 0x04 | TYPE_STR,
    TAG_NIL            : 0x05            | TYPE_BOOL | TYPE_NUM,
    TAG_FALSE          : 0x06            | TYPE_BOOL | TYPE_NUM,
    TAG_TRUE           : 0x07            | TYPE_BOOL | TYPE_NUM,
    TAG_PTR            : 0x08,
    TAG_FLOAT          : 0x09            | TYPE_BOOL | TYPE_NUM,
    TAG_STR            : 0x0a | TYPE_STR,
    TAG_ARRAY          : 0x0b,
    TAG_FUNCTION       : 0x0c,
    TAG_UNUSED         : 0xff,

    STATE_INIT     : 0,
    STATE_RUNNING  : 3,
    STATE_SUSPENDED: 5,
    STATE_DONE     : 6,

    STATE_LOOP_BREAK: 10,
    STATE_PENDING   : 20,
  };

  if (typeof global.sc !== "undefined") {
    Object.keys(C).forEach(function(key) {
      global.sc[key] = C[key];
    });
  }
  if (typeof module !== "undefined") {
    module.exports = C;
  }

})(this.self || global);
