/**
 * Prototype : In Javascript everthing is Object, like arrays , function. Prototype is a internal mechanism where Javascript Ojects inherits properties from one another.
 * Prototype will have its own Prototype, making what's calld prototype chain.
 */

const obj1 = {
  city: "Hyderabad",
  name: "Prashant",
  greet: function () {
    console.log(`Hi ${this.name}!`);
  },
};

obj1.greet();
console.log(obj1.__proto__);
console.log(obj1.toString());
