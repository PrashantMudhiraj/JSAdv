/**
 * The this keyword refers to the context where a piece of code, such as function body, is supposed to run. Mostly typically it is used in objects, where this refers to the object.
 *
 * When a function is invoked as a method of an object, then this refers to object (obj.method())
 * When a function is invoked as standalone function(fun()), then this refer to global in non strict mode, undefined in strict mode
 */

/**
 * There are Four types of binding rules (in priority order)
 * 1. new binding
 * 2. Explicit binding (call,apply,bind)
 *          1.bind() : The bind() function create a new bound function. Calling the bound function generally result in execution of the function its wraps(target function).
 *          2.call() : object function invocation on fly, arguments are comma(,) separated
 *          3.apply() : object function invocation on fly, arguments are in array
 * 3. Implicit binding  (object before the dot)
 * 4. Default binding (global/undefined in strict mode)
 */

/**
 * 1.Default binding(lowest priority) : A Plane function call, no object, no new, no call/apply/bind
 * Behavior
 *  1. Non-strict mode : this -> global object(window / global)
 *  2. Strict mode : this -> undefined
 */

//Example
// "use strict";

function show() {
    console.log(this); // global object & undefined for strict mode
}

// show();

//--------------------------------------------------------------------------------------------------------------

/**
 * 2.Implicit binding : A function called as a method : obj.fn()
 * this -> the object before the dot.
 */

const user = {
    name: "Prashant",
    say() {
        console.log(this.name);
    },
};
user.say();

//--------------------------------------------------------------------------------------------------------------

//3.Explicit binding : call(), apply(), bind()
let customer1 = {
    firstName: "Prashant",
    lastName: "Chevula",
    //   printFullName: function () {
    //     console.log(this.firstName + " " + this.lastName);
    //   },
};

let printFullName = function (hometown) {
    console.log(this.firstName + " " + this.lastName + " " + hometown);
};

// printFullName.call(customer1, "Hyderabad");

let customer2 = {
    firstName: "Raju",
    lastName: "Chevula",
};

// printFullName.call(customer2, "Warangal");
// printFullName.apply(customer1, ["hometown"]);

let printMyName = printFullName.bind(customer2, "Hyderabad1");
// console.log(printMyName());

const obj = {
    x: 42, // this object property not variable declaration
    getX() {
        // console.log(this.x, x); // throws a error : x is not defined why because x is not declared. So, we have bounded this in function, it can refer to current object. where x is accessible
        return this.x;
    },
};

const unboundGetX = obj.getX();
// console.log(unboundGetX);

const numbers = [5, 6, 7, 8, 12];
const max = Math.max(...numbers);
// console.log(max);

const maxC_ = Math.max.call(null, ...numbers); // comma separated for call method
// console.log(...numbers);
// console.log(maxC_);

const maxA_ = Math.max.apply(null, numbers); // array for apply method
// console.log(numbers);
// console.log(maxA_);

//--------------------------------------------------------------------------------------------------------------

/**
 *  4. new Binding(highest priority) : Function is called with new
 */
function User(name) {
    this.name = name;
}

User.prototype.sayName = function () {
    //prototype lookup
    console.log(this.name);
};

//Equivalent code
/**
 * class User {
    constructor(name) {
        this.name = name;
    }
    sayName() {
        //prototype lookup
        console.log(this.name);
    }
}
 */

const u1 = new User("Prashant");
// u1.sayName();
