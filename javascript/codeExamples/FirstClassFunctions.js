/**
 * First Class Functions :  A programming language is said to have a First-class functions when functions in that language are treated like any other variables. For example,in such a language, a function can be passed as an argument to other functions, can be treated by another function and can be assigned as a value to a variable.
 * - Function Statement
 * - Function Expression
 * - Function Declaration
 */

//a() // 'a'
//b() // 'error : b is not a function' -> undefined

// Function Statement aka Function Declaration
function a(param1, param2 = 0) {
  console.log("a");
}

// Function Expression
let b = function () {
  console.log("b");
};

a("argument"); // argument

// Anonymous function - A function without a name
// Named function
let c = function c1() {
  console.log("c1");
};

// First-class function

function fun1(cb) {
  return cb;
}

function cb() {
  console.log("Im cb");
}

fun1(cb)();
