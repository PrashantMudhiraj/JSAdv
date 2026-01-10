/**
 * Functional Programming
 *
 *
 * High order function : A Function takes a function as a argument and return a function
 */

const radius = [3, 1, 2, 4];

const area = (r) => Math.PI * r * r;
const circumference = (r) => 2 * Math.PI * r;
const diameter = (r) => 2 * r;

Array.prototype.calculate = function (logic) {
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
