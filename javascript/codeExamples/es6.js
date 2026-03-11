/**
 * spread -> expand values
 * spread is a shallow copy
 */

const a = [1, 2];
const b = [...a, 3];
console.log(a);
console.log({ ...b }); // {index : value}

const a1 = { x: 1 };
const b1 = { ...a1, y: 2 };

console.log(b1);

const a2 = [1, 2, [3, 4]];
console.log([...a2, 5]); // shallow copy

const b2 = { x: 1, y: { z: 1 } };
const copy1 = { ...b2 };

copy1.y.z = 2; // shared reference, hence edit b2 object as well
console.log(copy1);
console.log(b2);

const copy2 = structuredClone(b2); // deep copy no shared reference
copy2.y.z = 10;
console.log(copy2);
console.log(b2);

/**
 * Rest - Collect value
 */

function sum(...numbers) {
    return numbers.reduce((acc, curr) => acc + curr, 0);
}
console.log(sum(1, 2, 3, 4, 5, 6, 7, 8, 9, 10));

const [first, ...rest] = [1, 2, 3];
console.log(first, rest);

/**
 * Destructing - unpack value
 */

const [num1, num2 = 0] = [1];
console.log(num1, num2);

const info = {
    name: "Prashant",
    place: "Telangana",
    a: { x: 1 },
};

const {
    name: userName,
    place: userLocation,
    userRole = "default",
    a: { x: someData },
} = info;
console.log(userName, userLocation, userRole, someData);

/**
 * Optional chaining ?.?.?.
 */
console.log(info?.name);
// console.log(info.x.y); // error
// console.log(info.x?.y); // undefined

/**
 * Nullish Coalescing(??)
 */ console.log(0 ?? 1); //console.log(-1 ?? 1); //-console.log(null ?? 1); //console.log(undefined ?? 1); //1

/**
 * ES3 Classes
 */

class User {
    constructor() {
        this.name = userName;
    }

    sayName() {
        console.log(this.name);
    }
}

const user1 = new User("Prashant");
user1.sayName();
