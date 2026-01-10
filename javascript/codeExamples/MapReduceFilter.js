/**
 * map, reduce, filter:
 * - All three are higher order functions
 * - defined of Array.prototype
 * - Do not mutate the original array(unless you mutate inside call back)
 * - iterate left -> right
 * - skip empty slots in sparse arrays
 *
 * Pattern
 *  array.method((element,index,array) => newValue ,thisArg)
 */

const arr = [1, 2, 3, 4, 5, , 7, [1, 2]];
const modArr = arr.flat();

// console.log(modArr);
// console.log(modArr.map((x, i) => x * 2));
// console.log(modArr.map((x) => x * 3));
// console.log(modArr.map((x) => x.toString(2)));

// console.log(modArr.filter((x) => x % 2));
// console.log(modArr.filter((x) => x % 2 === 0));
// console.log(modArr.filter((x) => x > 4));

// console.log(modArr.reduce((acc, curr, index, array) => acc + curr, 0));

const max = modArr.reduce((acc, curr, index, array) => {
    if (acc < curr) {
        return curr;
    }
    return acc;
}, 0);

// console.log(max);

const users = [
    { firstName: "Prashant", lastName: "Chevula", age: 26 },
    { firstName: "Donald", lastName: "trump", age: 75 },
    { firstName: "Elon", lastName: "musk", age: 50 },
    { firstName: "Prabhas", lastName: "Raj", age: 26 },
];

const fullName = users.map((user) => `${user.firstName} ${user.lastName}`);

// console.log(fullName);

const ageGroupBy = users.reduce((acc, user, index, array) => {
    if (!acc[user.age]) {
        acc[user.age] = 1;
    } else {
        acc[user.age] += 1;
    }
    return acc;
}, {});

console.log(ageGroupBy);

// const filterByAge = users
//     .filter((user) => user.age < 30)
//     .map((user) => user.firstName);

const filterByAge = users.reduce((acc, user, index, array) => {
    if (user.age < 30) [acc.push(user.firstName)];
    return acc;
}, []);

console.log(filterByAge);

//-----------------------
const arr2 = [1, 2, 3, [4, 5, [6, 7, 8]], 9];

function deepFlat(arr) {
    return arr.reduce((acc, curr) => {
        if (Array.isArray(curr)) {
            acc.push(...deepFlat(curr));
        } else {
            acc.push(curr);
        }
        return acc;
    }, []);
}

const res = deepFlat(arr2);
console.log(res);
