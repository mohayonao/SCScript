SCScript.install(function(sc) {
  "use strict";

  require("./Stream");

  var fn    = sc.lang.fn;
  var utils = sc.lang.klass.utils;
  var BOOL  = utils.BOOL;
  var $nil  = utils.$nil;

  function SCUnaryOpStream(args) {
    this.__initializeWith__("Stream");
    this._$operator = args.shift() || /* istanbul ignore next */ $nil;
    this._$a        = args.shift() || /* istanbul ignore next */ $nil;
  }

  sc.lang.klass.define(SCUnaryOpStream, "UnaryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.next = fn(function($inval) {
      var $vala;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      return $vala.perform(this._$operator);
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  function SCBinaryOpStream(args) {
    this.__initializeWith__("Stream");
    this._$operator = args.shift() || /* istanbul ignore next */ $nil;
    this._$a        = args.shift() || /* istanbul ignore next */ $nil;
    this._$b        = args.shift() || /* istanbul ignore next */ $nil;
  }

  sc.lang.klass.define(SCBinaryOpStream, "BinaryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.next = fn(function($inval) {
      var $vala, $valb;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      $valb = this._$b.next($inval);
      if ($valb === $nil) {
        return $nil;
      }

      return $vala.perform(this._$operator, $valb);
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      this._$b.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  function SCBinaryOpXStream(args) {
    this.__initializeWith__("Stream");
    this._$operator = args.shift() || /* istanbul ignore next */ $nil;
    this._$a        = args.shift() || /* istanbul ignore next */ $nil;
    this._$b        = args.shift() || /* istanbul ignore next */ $nil;
    this._$vala     = $nil;
  }

  sc.lang.klass.define(SCBinaryOpXStream, "BinaryOpXStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.next = fn(function($inval) {
      var $valb;

      if (this._$vala === $nil) {
        this._$vala = this._$a.next($inval);
        if (this._$vala === $nil) {
          return $nil;
        }
        $valb = this._$b.next($inval);
        if ($valb === $nil) {
          return $nil;
        }
      } else {
        $valb = this._$b.next($inval);
        if ($valb === $nil) {
          this._$vala = this._$a.next($inval);
          if (this._$vala === $nil) {
            return $nil;
          }
          this._$b.reset();
          $valb = this._$b.next($inval);
          if ($valb === $nil) {
            return $nil;
          }
        }
      }

      return this._$vala.perform(this._$operator, $valb);
    }, "inval");

    spec.reset = function() {
      this._$vala = $nil;
      this._$a.reset();
      this._$b.reset();
      return this;
    };

    // TODO: implements storeOn
  });

  function SCNAryOpStream(args) {
    var $arglist;
    this.__initializeWith__("Stream");
    this._$operator = args.shift() || /* istanbul ignore next */ $nil;
    this._$a        = args.shift() || /* istanbul ignore next */ $nil;

    $arglist = args.shift() || /* istanbul ignore next */ $nil;
    if (Array.isArray($arglist._)) {
      this._arglist = $arglist._;
    } else {
      this._arglist = [];
    }
    this._isNumeric = this._arglist.every(function($item) {
      return $item.__tag === sc.C.TAG_SYM || BOOL($item.isNumber());
    });
  }

  sc.lang.klass.define(SCNAryOpStream, "NAryOpStream : Stream", function(spec, utils) {
    var $nil = utils.$nil;

    spec.next = fn(function($inval) {
      var $vala;
      var values;

      $vala = this._$a.next($inval);
      if ($vala === $nil) {
        return $nil;
      }

      if (this._isNumeric) {
        values = this._arglist;
      } else {
        values = this._arglist.map(function($item) {
          var $res;

          $res = $item.next($inval);
          if ($res === $nil) {
            return $nil;
          }

          return $res;
        });
      }

      return $vala.perform.apply($vala, [ this._$operator ].concat(values));
    }, "inval");

    spec.reset = function() {
      this._$a.reset();
      this._arglist.forEach(function($item) {
        $item.reset();
      });
      return this;
    };

    // TODO: implements storeOn
  });

});
