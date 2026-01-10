const obj1 = {
    a: 1,
    b: 2,
    c: 3,
};

console.log(Object.keys(obj1));
console.log(Object.values(obj1));
console.log(Object.entries(obj1));

console.log(Object.entries(obj1).map(([k, v]) => `${k} : ${v}`));
console.log("a" in obj1);
console.log(obj1.hasOwnProperty("a"));
console.log(Object.hasOwn(obj1, "a"));

// Object.freeze(obj1)

// obj1.d = 1; //prevent insert/update/remove
// console.log(obj1);

Object.seal(obj1);
obj1.d = 1; // prevent insert/remove
obj1.a = 10; // allow update
console.log(obj1);

const a = {};
const b = {};

console.log(Object.is(a, a));
console.log(Object.is(a, b));
