/**
 * Prototype : In Javascript everthing is Object, like arrays , function. Prototype is a internal mechanism where Javascript Ojects inherits properties from one another.
 * Prototype will have its own Prototype, making what's calld prototype chain.
 */

Array.prototype.logData = function () {
  this.map((x) => console.log(x));
};
const arr = [1, 2, 3, 4];

arr.logData();
arr.entries().forEach(([index, value]) => console.log(index, value)); // works in latest brower, not old or < less than node 20)

const obj1 = {
  city: "Hyderabad",
  name: "Prashant",
  greet: function () {
    console.log(`Hi ${this.name}!`);
  },
};

obj1.greet();
// console.log(obj1.__proto__);
// console.log(obj1.toString());

/**
 * obj1.__proto__ -> Object prototype
 * obj1.__proto__.__proto__ -> null
 * hello.__proto__ -> function
 * hello.__proto__.__proto__ -> Object
 * hello.__proto__.__proto__.__proto__ ->null
 */
