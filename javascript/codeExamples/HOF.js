/**
 * Functional Programming : It is a style of programming, where computation is done using pure functions, immutability, composition, avoiding shared state and side effects.
 */

//1. Pure functions
// same input -> same output
// no side effects

function add(x, y) {
    return x + y;
}

//2. immutability

const arr = [1, 2, 3];
const newArr = [...arr, 4, 5];

//arr.push(4) -> don't do this

//3. Higher Order Functions
//4. Function curring : is a transformative technique in functional programming where a function with multiple arguments is converted into sequence of functions,each tasking a single argument
// Event Handling : Creating partially applied functions that are tailored for specific events but reuse a common handler logic
// API calls : Setting up functions with predefined arguments like API keys or user IDs that can be used repeatedly across different calls

function curriedAdd(a) {
    return function (b) {
        return a + b;
    };
}

const addFive = curriedAdd(5);
console.log(addFive(3));

//5. Memoize : It is an optimization technique used in functional programming to speed up the computer programs by storing the results of expensive api calls and returns a cached result when a same input occurs

function memoize(fn) {
    const cache = new Map();
    return function (...args) {
        const key = args.toString();
        if (!cache.get(key)) {
            cache.set(key, fn(args));
        }
        console.log(cache);
        return cache.get(key);
    };
}
function fact(x) {
    if (x == 0) return 1;
    return x * factorial(x - 1);
}
const factorial = memoize(fact);

console.log(factorial(5));
console.log(factorial(5));

/**
 * High order function : A Function takes one or more functions as a argument and returns a function. This is possible because functions are first class citizens
 */

function cb() {
    console.log("I'm callback");
}

function x(cb) {
    return cb();
}
console.log(x(cb));

//-----

const radius = [3, 1, 2, 4];

const area = (r) => Math.PI * r * r;
const circumference = (r) => 2 * Math.PI * r;
const diameter = (r) => 2 * r;

Array.prototype.calculate = function (logic) {
    // passing function as argument
    console.log(this);
    const output = [];
    for (let index = 0; index < this.length; index++) {
        output.push(logic(this[index]));
    }
    return output;
};

// console.log(radius.map(area));
console.log(radius.calculate(area));

// console.log(radius.map(circumference));
// console.log(radius.calculate(circumference));

// console.log(radius.map(diameter));
// console.log(radius.calculate(diameter));
