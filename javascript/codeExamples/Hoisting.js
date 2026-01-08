/**
 *  HOISTING : Values of the variables can be accessible before its declartion. It is due to behaviour of JavaScript, When a program is executed, it will run in 2 phases, the 1st phase is memory creation phase where all variable and function declations will be stored and in the 2nd phase code execution will happen. So, here all variable were available in memory to access(heap). whenever we try to access a varaible before its declartion, It will try to check in memory and if available, then return undefined(placeholder).
 * var is hoisted, Can be accessible from anywhere in the program (with undefined placeholder)
 * let is hoisted, But it is in temporal dead zone, can not be accessible -Reference Error
 * const is hoisted, But it is in temporal dead zone, can not be accessible
 *
 *Temporal Dead Zone : The time between variable initialization and declartion(value assigment) to that variable
 */

// getName(); // "Hello World"
// console.log(x); // undefined
// console.log(getName); // [Function: getName]

var x = 7;
// console.log(globalThis.global);

function getName() {
  console.log("Hello World", z); // Hello World , undefined
}

getName(); //"Hello World"
console.log(x); //2
var z = 1;
