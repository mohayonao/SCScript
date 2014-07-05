/* jshint browser: true, devel: true */
/* global $, SCScript, esprima, escodegen */
$(function() {
  "use strict";

  var $source  = $("#source");
  var $results = $("#results");
  var $message = $("#message");
  var prev = [ "", "CODE" ];
  var hash;

  function beautify(code) {
    return escodegen.generate(esprima.parse(code), { indent: "  " });
  }

  function update(code, mode) {
    if (prev[0] !== code || prev[1] !== mode) {
      try {
        switch (mode) {
        case "CODE":
          $results.text(beautify(SCScript.compile(code)));
          break;
        case "AST":
          $results.text(JSON.stringify(SCScript.parse(code), null, 2));
          break;
        case "TOKEN":
          $results.text(JSON.stringify(SCScript.tokenize(code), null, 2));
          break;
        }
        $message.text("");
        window.location.replace("#" + encodeURIComponent(code));
      } catch (e) {
        $message.text(e.toString());
      }
      prev = [ code, mode ];
    }
  }

  $("#selector a").each(function(i, elem) {
    $(elem).on("click", function() {
      update(prev[0], $(elem).text());
    });
  });

  $source.on("keyup", function() {
    update($source.val(), prev[1]);
  });

  if (window.location.hash) {
    hash = decodeURIComponent(window.location.hash.substr(1));
    $source.val(hash);
    update(hash, prev[1]);
  }
});
