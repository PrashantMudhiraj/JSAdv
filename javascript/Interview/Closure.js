/**
 * Module design pattern
 * Function currying
 * Data hiding and Encapsulation
 * memoize
 */

function outer() {
  //   var a = 10;
  function inner() {
    console.log(a);
  }
  let a = 10;
  return inner;
}

console.log(outer());
outer()();
