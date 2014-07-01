__report = {"info":{"file":"src/sc/lang/compiler/lexer/number.js","fileShort":"lang/compiler/lexer/number.js","fileSafe":"lang_compiler_lexer_number_js","link":"files/lang_compiler_lexer_number_js/index.html"},"complexity":{"aggregate":{"line":1,"complexity":{"sloc":{"physical":157,"logical":100},"cyclomatic":20,"halstead":{"operators":{"distinct":27,"total":304,"identifiers":["__stripped__"]},"operands":{"distinct":79,"total":342,"identifiers":["__stripped__"]},"length":646,"vocabulary":106,"difficulty":58.44303797468354,"volume":4346.236613647827,"effort":254007.27145837992,"bugs":1.4487455378826088,"time":14111.515081021107},"params":17}},"functions":[{"name":"<anonymous>","line":1,"complexity":{"sloc":{"physical":157,"logical":17},"cyclomatic":1,"halstead":{"operators":{"distinct":5,"total":45,"identifiers":["__stripped__"]},"operands":{"distinct":24,"total":48,"identifiers":["__stripped__"]},"length":93,"vocabulary":29,"difficulty":5,"volume":451.7922325468643,"effort":2258.9611627343215,"bugs":0.15059741084895475,"time":125.49784237412898},"params":1}},{"name":"NumberLexer","line":9,"complexity":{"sloc":{"physical":4,"logical":2},"cyclomatic":1,"halstead":{"operators":{"distinct":2,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":3,"total":8,"identifiers":["__stripped__"]},"length":12,"vocabulary":5,"difficulty":2.6666666666666665,"volume":27.863137138648348,"effort":74.30169903639559,"bugs":0.00928771237954945,"time":4.1278721686886435},"params":2}},{"name":"<anonymous>.scan","line":14,"complexity":{"sloc":{"physical":6,"logical":1},"cyclomatic":4,"halstead":{"operators":{"distinct":4,"total":12,"identifiers":["__stripped__"]},"operands":{"distinct":5,"total":8,"identifiers":["__stripped__"]},"length":20,"vocabulary":9,"difficulty":3.2,"volume":63.39850002884625,"effort":202.875200092308,"bugs":0.02113283334294875,"time":11.270844449572667},"params":0}},{"name":"<anonymous>.match","line":21,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":3,"total":7,"identifiers":["__stripped__"]},"operands":{"distinct":6,"total":8,"identifiers":["__stripped__"]},"length":15,"vocabulary":9,"difficulty":2,"volume":47.548875021634686,"effort":95.09775004326937,"bugs":0.01584962500721156,"time":5.2832083357371875},"params":1}},{"name":"<anonymous>.scanNAryNumberLiteral","line":25,"complexity":{"sloc":{"physical":33,"logical":21},"cyclomatic":6,"halstead":{"operators":{"distinct":16,"total":62,"identifiers":["__stripped__"]},"operands":{"distinct":32,"total":69,"identifiers":["__stripped__"]},"length":131,"vocabulary":48,"difficulty":17.25,"volume":731.6300875944715,"effort":12620.619011004634,"bugs":0.24387669586482386,"time":701.1455006113686},"params":0}},{"name":"<anonymous>.scanHexNumberLiteral","line":59,"complexity":{"sloc":{"physical":15,"logical":8},"cyclomatic":2,"halstead":{"operators":{"distinct":8,"total":26,"identifiers":["__stripped__"]},"operands":{"distinct":16,"total":24,"identifiers":["__stripped__"]},"length":50,"vocabulary":24,"difficulty":6,"volume":229.24812503605784,"effort":1375.488750216347,"bugs":0.07641604167868594,"time":76.41604167868594},"params":0}},{"name":"<anonymous>.scanAccidentalNumberLiteral","line":75,"complexity":{"sloc":{"physical":21,"logical":13},"cyclomatic":4,"halstead":{"operators":{"distinct":14,"total":47,"identifiers":["__stripped__"]},"operands":{"distinct":28,"total":49,"identifiers":["__stripped__"]},"length":96,"vocabulary":42,"difficulty":12.25,"volume":517.662472586761,"effort":6341.365289187823,"bugs":0.17255415752892037,"time":352.2980716215457},"params":0}},{"name":"<anonymous>.scanDecimalNumberLiteral","line":97,"complexity":{"sloc":{"physical":14,"logical":7},"cyclomatic":3,"halstead":{"operators":{"distinct":9,"total":31,"identifiers":["__stripped__"]},"operands":{"distinct":19,"total":30,"identifiers":["__stripped__"]},"length":61,"vocabulary":28,"difficulty":7.105263157894737,"volume":293.24865024551383,"effort":2083.608830691809,"bugs":0.09774955008183794,"time":115.75604614954494},"params":0}},{"name":"removeUnderscore","line":112,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":4,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"length":10,"vocabulary":8,"difficulty":3,"volume":30,"effort":90,"bugs":0.01,"time":5},"params":1}},{"name":"char2num","line":116,"complexity":{"sloc":{"physical":7,"logical":4},"cyclomatic":2,"halstead":{"operators":{"distinct":7,"total":8,"identifiers":["__stripped__"]},"operands":{"distinct":6,"total":12,"identifiers":["__stripped__"]},"length":20,"vocabulary":13,"difficulty":7,"volume":74.00879436282185,"effort":518.0615605397529,"bugs":0.024669598120940616,"time":28.781197807764052},"params":2}},{"name":"calcNBasedInteger","line":124,"complexity":{"sloc":{"physical":8,"logical":7},"cyclomatic":2,"halstead":{"operators":{"distinct":10,"total":14,"identifiers":["__stripped__"]},"operands":{"distinct":8,"total":20,"identifiers":["__stripped__"]},"length":34,"vocabulary":18,"difficulty":12.5,"volume":141.7774500490386,"effort":1772.2181256129825,"bugs":0.0472591500163462,"time":98.45656253405458},"params":2}},{"name":"calcNBasedFrac","line":133,"complexity":{"sloc":{"physical":7,"logical":6},"cyclomatic":2,"halstead":{"operators":{"distinct":12,"total":18,"identifiers":["__stripped__"]},"operands":{"distinct":11,"total":23,"identifiers":["__stripped__"]},"length":41,"vocabulary":23,"difficulty":12.545454545454545,"volume":185.46604019833754,"effort":2326.755777033689,"bugs":0.061822013399445847,"time":129.26420983520495},"params":2}},{"name":"makeNumberToken","line":141,"complexity":{"sloc":{"physical":12,"logical":9},"cyclomatic":3,"halstead":{"operators":{"distinct":12,"total":20,"identifiers":["__stripped__"]},"operands":{"distinct":12,"total":29,"identifiers":["__stripped__"]},"length":49,"vocabulary":24,"difficulty":14.5,"volume":224.66316253533668,"effort":3257.615856762382,"bugs":0.07488772084511222,"time":180.97865870902123},"params":4}},{"name":"<anonymous>.lexNumber","line":154,"complexity":{"sloc":{"physical":3,"logical":1},"cyclomatic":1,"halstead":{"operators":{"distinct":4,"total":4,"identifiers":["__stripped__"]},"operands":{"distinct":4,"total":6,"identifiers":["__stripped__"]},"length":10,"vocabulary":8,"difficulty":3,"volume":30,"effort":90,"bugs":0.01,"time":5},"params":2}}],"maintainability":112.71097123402785,"params":1.2142857142857142,"module":"lang/compiler/lexer/number.js"},"jshint":{"messages":[]}}