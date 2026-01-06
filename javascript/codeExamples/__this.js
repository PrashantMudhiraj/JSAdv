/**
 * The this keyword refers to the context where a piece of code, such as function body, is supposed to run. Mostly typically it is used in objects, where this refers to the object.
 *
 * When a function is invoked as a method of an object, then this refers to object (obj.method())
 * When a function is invoked as standalone function(fun()), then this refer to global in non strict mode, undefiend in strict mode
 */

/**
 * Methods : call(), bind(), apply()
 */

let customer1 = {
  firstname: "Prashant",
  lastname: "Chevula",
  //   printFullName: function () {
  //     console.log(this.firstname + " " + this.lastname);
  //   },
};

let printFullName = function (hometown) {
  console.log(this.firstname + " " + this.lastname + " " + hometown);
};

printFullName.call(customer1, "Hyderabad");

let customer2 = {
  firstname: "Raju",
  lastname: "Chevula",
};

printFullName.call(customer2, "Warangal");
printFullName.apply(customer1, ["hometown"]);

let printMyName = printFullName.bind(customer2, "Hyderabad1");
// console.log(printMyName());

/**
 *  bind() : The bind() function create a new bound function. Calling the bound function generally result in execution of the function its wraps(target function).
 */

const obj = {
  x: 42, // this object property not variable declaration
  getX() {
    // console.log(this.x, x); // throws a error : x is not defined why because x is not declared. So, we have bounded this in function, it can refer to current object. where x is accessible
    return this.x;
  },
};

const unboundGetX = obj.getX();
// console.log(unboundGetX);

/**
 * call() : object function invocation on fly, arguments are comma(,) seperated
 * apply() : object function invocation on fly, arguments are in array
 */

const numbers = [5, 6, 7, 8, 12];
const max = Math.max(...numbers);
console.log(max);

const maxC_ = Math.max.call(null, ...numbers);
console.log(...numbers);
console.log(maxC_);

const maxA_ = Math.max.apply(null, numbers);
console.log(numbers);
console.log(maxA_);
