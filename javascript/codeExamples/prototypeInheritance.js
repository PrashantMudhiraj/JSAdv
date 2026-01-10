/**
 * Prototype : In Javascript everything is Object, like arrays , function. Prototype is a internal mechanism where Javascript Objects inherits properties from one another.
 * Prototype will have its own Prototype, making what's called prototype chain.
 * The root of all objects -> Object.prototype
 */

Array.prototype.logData = function () {
    this.map((x) => console.log(x));
};
const arr = [1, 2, 3, 4];

arr.logData();
arr.entries().forEach(([index, value]) => console.log(index, value)); // works in latest browser, not old or < less than node 20)

const obj = {
    city: "Hyderabad",
    name: "Prashant",
    greet: function () {
        console.log(`Hi ${this.name}!`);
    },
};

obj.greet();
// console.log(obj.__proto__);
// console.log(obj.toString());// [object object]

function fn() {}

/**
 * obj.__proto__ -> Object prototype
 * obj.__proto__.__proto__ -> null
 * fn.__proto__ -> function
 * fn.__proto__.__proto__ -> Object
 * fn.__proto__.__proto__.__proto__ ->null
 */

const parent = {
    a: 1,
};
const child = Object.create(parent);
child.b = 2;

console.log(child); // { b : 2 }
console.log(child.__proto__); // { a: 1 }
console.log(child.__proto__.__proto__); // [Object: null prototype] {}
console.log(child.__proto__.__proto__.__proto__); // null

console.log(child.hasOwnProperty("a")); //false //checks only the object
console.log("a" in child); //true //checks entire object
console.log(child.__proto__.hasOwnProperty("a")); //true //checks only parent object
console.log(child.__proto__.hasOwnProperty("b")); //false //checks only parent object
