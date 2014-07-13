describe("sc.libs.extend", function() {
  "use strict";

  it("extend", function() {
    function P() {}
    P.prototype.method = function() {};

    function C() {}
    sc.libs.extend(C, P);

    var instance = new C();
    expect(instance).to.instanceOf(P);
    expect(instance).to.respondTo("method");
  });

});
