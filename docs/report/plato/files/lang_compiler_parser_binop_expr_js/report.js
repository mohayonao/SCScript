__report = {"info":{"file":"src/sc/lang/compiler/parser/binop-expr.js","fileShort":"lang/compiler/parser/binop-expr.js","fileSafe":"lang_compiler_parser_binop_expr_js","link":"files/lang_compiler_parser_binop_expr_js/index.html"},"complexity":{"aggregate":{"line":1,"complexity":{"sloc":{"physical":160,"logical":85},"cyclomatic":14,"halstead":{"operators":{"distinct":19,"total":269,"identifiers":["__stripped__"]},"operands":{"distinct":82,"total":297,"identifiers":["__stripped__"]},"length":566,"vocabulary":101,"difficulty":34.40853658536585,"volume":3768.547699237516,"effort":129670.21138291038,"bugs":1.2561825664125055,"time":7203.900632383909},"params":18}},"functions":[{"name":"<anonymous>","line":1,"complexity":{"sloc":{"physical":160,"logical":21},"cyclomatic":1,"halstead":{"operators":{"distinct":5,"total":55,"identifiers":["__stripped__"]},"operands":{"distinct":28,"total":61,"identifiers":["__stripped__"]},"length":116,"vocabulary":33,"difficulty":5.446428571428571,"volume":585.1497178455805,"effort":3186.976141837537,"bugs":0.19504990594852684,"time":177.0542301020854},"params":1}},{"name":"<anonymous>","line":23,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":4,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":3,"total":3,"identifiers":["__stripped__"]},"length":7,"vocabulary":7,"difficulty":2,"volume":19.651484454403228,"effort":39.302968908806456,"bugs":0.00655049481813441,"time":2.1834982727114696},"params":0}},{"name":"BinaryExpressionParser","line":27,"complexity":{"sloc":{"physical":4,"logical":2},"cyclomatic":1,"halstead":{"operators":{"distinct":3,"total":7,"identifiers":["__stripped__"]},"operands":{"distinct":9,"total":11,"identifiers":["__stripped__"]},"length":18,"vocabulary":12,"difficulty":1.8333333333333335,"volume":64.52932501298082,"effort":118.30376252379818,"bugs":0.02150977500432694,"time":6.572431251322121},"params":1}},{"name":"<anonymous>.parse","line":33,"complexity":{"sloc":{"physical":14,"logical":7},"cyclomatic":2,"halstead":{"operators":{"distinct":7,"total":23,"identifiers":["__stripped__"]},"operands":{"distinct":12,"total":23,"identifiers":["__stripped__"]},"length":46,"vocabulary":19,"difficulty":6.708333333333334,"volume":195.40466561840492,"effort":1310.8396318567998,"bugs":0.0651348885394683,"time":72.82442399204443},"params":0}},{"name":"<anonymous>.calcBinaryPrecedence","line":48,"complexity":{"sloc":{"physical":17,"logical":9},"cyclomatic":6,"halstead":{"operators":{"distinct":8,"total":22,"identifiers":["__stripped__"]},"operands":{"distinct":13,"total":23,"identifiers":["__stripped__"]},"length":45,"vocabulary":21,"difficulty":7.076923076923077,"volume":197.65428402504423,"effort":1398.7841638695438,"bugs":0.0658847613416814,"time":77.71023132608576},"params":1}},{"name":"<anonymous>.parseBinaryExpressionOperator","line":66,"complexity":{"sloc":{"physical":6,"logical":4},"cyclomatic":1,"halstead":{"operators":{"distinct":5,"total":11,"identifiers":["__stripped__"]},"operands":{"distinct":6,"total":12,"identifiers":["__stripped__"]},"length":23,"vocabulary":11,"difficulty":5,"volume":79.56692722865785,"effort":397.83463614328923,"bugs":0.026522309076219282,"time":22.101924230182735},"params":1}},{"name":"<anonymous>.sortByBinaryPrecedence","line":73,"complexity":{"sloc":{"physical":16,"logical":9},"cyclomatic":2,"halstead":{"operators":{"distinct":8,"total":31,"identifiers":["__stripped__"]},"operands":{"distinct":17,"total":41,"identifiers":["__stripped__"]},"length":72,"vocabulary":25,"difficulty":9.647058823529411,"volume":334.35764566378015,"effort":3225.567875815291,"bugs":0.11145254855459338,"time":179.1982153230717},"params":3}},{"name":"<anonymous>.parseBinaryExpressionAdverb","line":90,"complexity":{"sloc":{"physical":22,"logical":12},"cyclomatic":4,"halstead":{"operators":{"distinct":9,"total":36,"identifiers":["__stripped__"]},"operands":{"distinct":22,"total":34,"identifiers":["__stripped__"]},"length":70,"vocabulary":31,"difficulty":6.954545454545454,"volume":346.7937417270813,"effort":2411.7928401928834,"bugs":0.1155979139090271,"time":133.98849112182685},"params":0}},{"name":"sortByBinaryPrecedence","line":113,"complexity":{"sloc":{"physical":11,"logical":6},"cyclomatic":2,"halstead":{"operators":{"distinct":5,"total":25,"identifiers":["__stripped__"]},"operands":{"distinct":14,"total":28,"identifiers":["__stripped__"]},"length":53,"vocabulary":19,"difficulty":5,"volume":225.14015821251002,"effort":1125.70079106255,"bugs":0.07504671940417,"time":62.538932836808335},"params":3}},{"name":"reduceBinaryExpressionStack","line":125,"complexity":{"sloc":{"physical":12,"logical":5},"cyclomatic":2,"halstead":{"operators":{"distinct":6,"total":22,"identifiers":["__stripped__"]},"operands":{"distinct":9,"total":22,"identifiers":["__stripped__"]},"length":44,"vocabulary":15,"difficulty":7.333333333333334,"volume":171.90318620677482,"effort":1260.6233655163487,"bugs":0.05730106206892494,"time":70.03463141757493},"params":2}},{"name":"peek","line":138,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":3,"total":5,"identifiers":["__stripped__"]},"length":9,"vocabulary":6,"difficulty":2.5,"volume":23.264662506490403,"effort":58.161656266226004,"bugs":0.007754887502163467,"time":3.2312031259014447},"params":1}},{"name":"isNeedSort","line":142,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":6,"total":9,"identifiers":["__stripped__"]},"operands":{"distinct":4,"total":11,"identifiers":["__stripped__"]},"length":20,"vocabulary":10,"difficulty":8.25,"volume":66.43856189774725,"effort":548.1181356564148,"bugs":0.02214618729924908,"time":30.451007536467486},"params":2}},{"name":"isBinaryOperator","line":146,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":3,"total":3,"identifiers":["__stripped__"]},"operands":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"length":7,"vocabulary":6,"difficulty":2,"volume":18.094737505048094,"effort":36.18947501009619,"bugs":0.006031579168349364,"time":2.0105263894497885},"params":1}},{"name":"isInteger","line":150,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":3,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":4,"total":5,"identifiers":["__stripped__"]},"length":9,"vocabulary":7,"difficulty":1.875,"volume":25.26619429851844,"effort":47.374114309722074,"bugs":0.008422064766172813,"time":2.6318952394290043},"params":1}},{"name":"isAdverb","line":154,"complexity":{"sloc":{"physical":6,"logical":3},"cyclomatic":2,"halstead":{"operators":{"distinct":5,"total":11,"identifiers":["__stripped__"]},"operands":{"distinct":10,"total":12,"identifiers":["__stripped__"]},"length":23,"vocabulary":15,"difficulty":3,"volume":89.85848369899593,"effort":269.57545109698776,"bugs":0.02995282789966531,"time":14.976413949832654},"params":1}}],"maintainability":119.41931563355229,"params":1.2,"module":"lang/compiler/parser/binop-expr.js"},"jshint":{"messages":[]}}