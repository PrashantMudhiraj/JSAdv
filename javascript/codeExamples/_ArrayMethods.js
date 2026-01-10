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

console.log(arr2.some((x) => x === 4));
console.log(arr2.every((x) => typeof x === "number"));
console.log(res.every((x) => typeof x === "number"));
console.log(res.includes(1));

console.log(res.flatMap((x) => [x, x * 2]));

console.log(res.sort((x, y) => y - x));

const a1 = [1, 2, 3, 4, 5, 6, 7];
console.log(a1.pop(), a1);
console.log(a1.push(7), a1);
console.log(a1.shift(), a1);
console.log(a1.unshift(1), a1);

console.log(a1);
console.log(a1.splice(1, 3, 10, 11)); //mutate // insert/remove elements
console.log(a1);
console.log(a1.slice(1, 3)); // non mutate // to get subarray
console.log(a1);
