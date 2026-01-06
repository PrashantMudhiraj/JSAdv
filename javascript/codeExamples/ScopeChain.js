/**
 * Scope : A Scope is a variable where it can be accessable.
 * Lexical environment is the local memory and Lexical environment of it's parent memory
 */

function a() {
  //function scope
  c();
  function c() {
    console.log(b); // 10
  }
}

var b = 10; //Global scope
a(); // function invocation
