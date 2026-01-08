/**
 * Closures - It is combination of function bundled together with references to it's surrounding state(the lexical environement). A closure gives a function access to its outer scope. in Javascript closres are created every time a function is created
 */

function x() {
  let a = 10;
  function y() {
    console.log(a);
  }
  y();
}

// x();

function counter(incrementBy) {
  let counter = 0;
  return function (x) {
    // console.log(x);
    return (counter = counter + (incrementBy || 1));
  };
}

const counter1 = counter(1);
console.log(counter1());
console.log(counter1());
console.log(counter1());
console.log(counter1());

console.log("-----------");

const counter2 = counter(2);
console.log(counter2());
console.log(counter2());
console.log(counter2());
console.log(counter2());
