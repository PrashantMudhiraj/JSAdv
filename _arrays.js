const fruits = [];

fruits.push("banana", "apple", "peach");
fruits[5] = "mongo";
// fruits[3] = undefined, fruits[4] = undefined
console.log(Object.keys(fruits));
// console.log(fruits);

// console.log((fruits.length = 2), fruits);

const iterator = fruits.keys();

for (let key of iterator) {
    console.log(key, fruits[key]);
}

console.log(fruits.toReversed());
const x = new Array(100).fill(1);
console.log(x.length);
