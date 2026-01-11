// Promise.all()
/**
 * Promise APIs coordinate asynchronous results. resolve/reject create settled Promises, then/catch/finally register microtask reactions, and combinator's (all, allSettled, race, any) coordinate multiple Promises with distinct failure semantics. They manage already-started async work rather than creating it.
 */

const p1 = Promise.reject(3);
const p2 = 42;
const p3 = new Promise((resolve, reject) => {
    setTimeout(reject, 100, "foo");
});

//parallel
Promise.all([p1, p2, p3])
    .then((res) => console.log("promise1 all -> " + res)) //resolve
    .catch((err) => console.log("promise1 all -> " + err)); //reject

Promise.allSettled([p1, p2, p3])
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

Promise.race([p1, p2, p3])
    .then((res) => console.log("promise1 race -> " + res))
    .catch((err) => console.log("promise1 race -> " + err));

Promise.any([p1, p2, p3])
    .then((res) => console.log("promise1 any -> " + res))
    .catch((err) => console.log("promise1 any -> " + err));

//sequential
//added await for each promise to run one by one
await Promise.all([p1, p2, p3])
    .then((res) => console.log("promise2 all -> " + res))
    .catch((err) => console.log("promise2 all -> " + err));

await Promise.allSettled([p1, p2, p3])
    .then((res) => console.log(res))
    .catch((err) => console.log(err));

await Promise.race([p1, p2, p3])
    .then((res) => console.log("promise2 race -> " + res))
    .catch((err) => console.log("promise2 race -> " + err));

await Promise.any([p1, p2, p3])
    .then((res) => console.log("promise2 any -> " + res))
    .catch((err) => console.log("promise2 any -> " + err));
