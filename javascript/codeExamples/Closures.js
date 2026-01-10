/**
 * Closures - It is combination of function bundled together with references to it's surrounding state(the lexical environment). A closure gives a function access to its outer scope. in Javascript closures are created every time a function is created
 * Each and every function have lexical scope.
 *
 * - these are exist because
 *      - Functions are first class
 *      - Functions can be returned
 *      - Returned functions may still need variables from where they were created
 */

function x() {
    let a = 10;
    function y() {
        console.log(a);
    }
    y();
}

// x();

function counter(x) {
    let counter = 0;
    return {
        increment() {
            // console.log(x);
            return (counter = counter + (x || 1));
        },
        decrement() {
            return (counter = counter - (x || 1));
        },
    };
}

const counter1 = counter(1);
console.log(counter1.increment());
console.log(counter1.increment());
console.log(counter1.decrement());
console.log(counter1.increment());

console.log("-----------");

const counter2 = counter(2);
console.log(counter2.increment());
console.log(counter2.decrement());
console.log(counter2.increment());
console.log(counter2.increment());

//------------------------------------------

function outer() {
    let a = 1;
    let b = 2; // garbage collected

    return function () {
        console.log(a);
    };
}
