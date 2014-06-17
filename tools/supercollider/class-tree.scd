(
  var tree = { |class, i = 0|
    var indent = "".padLeft(i);

  	if ("Common/(Au|Co|Ma|St)".matchRegexp(class.filenameSymbol.asString)) {
  		i = i + 2;
  		(indent ++ '- [ ] ' ++ class.name).postln;
  		if (class.name !== \Class) {
  			class.subclasses.do(tree.(_, i));
  		};
  		i = i - 2;
  	}
  };

  tree.(Object); 0
)
