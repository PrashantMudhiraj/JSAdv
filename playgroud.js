//compose(f, g, h)(x) => f(g(h(x)))
//pipe(f, g, h)(x) => h(g(f(x)))
//curring f(x,y,z) => f(x)(y)(z)

const pipe =
    (...fns) =>
    (x) =>
        fns.reduce((acc, fn) => fn(acc), x);

// function pipe() {
//     let fns = Array.prototype.slice.call(arguments);
//     // console.log(fns);

//     return function (x) {
//         return fns.reduce(function (acc, fn) {
//             return fn(acc);
//         }, x);
//     };
// }

// const double = (x) => x * 2;
// const addTen = (x) => x + 10;
// const square = (x) => x * x;

// const transformPipe = pipe(double, addTen, square);
// console.log(transformPipe(3));

// const compose =
//     (...fns) =>
//     (x) =>
//         fns.reduceRight((acc, fn) => fn(acc), x);

// console.log(compose(double, addTen, square)(3));

// const trim = (str) => str.trim();
// const toLowerCase = (str) => str.toLowerCase();
// const removeSpaces = (str) => str.replace(/\s/g, "_");

// console.log(pipe(trim, toLowerCase, removeSpaces)(" Hello World "));

// function add(a) {
//     return function (b) {
//         return function (c) {
//             return a + b + c;
//         };
//     };
// }

// const addFive = add(5)(5);

// console.log(addFive(5));
// console.log(addFive(10))
//
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
console.log(factorial(5)); // calculates
console.log(factorial(5)); // returns cached result
