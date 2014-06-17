(
  var todo = { |name, isClass|
  	("// TODO: implements " ++ if(isClass, $$, '') ++ name).postln
  };
  var test = { |name, isClass|
  	("it.skip(\"" ++ if(isClass, $., $#) ++ name ++ "\", function() {\n});").postln
  };
  var list = { |class, delegate|
  	class.class.methods.do { |method| delegate.(method.name, true ) };
  	class.methods.do       { |method| delegate.(method.name, false) };
  };

  list.(Magnitude, test); 0
)
