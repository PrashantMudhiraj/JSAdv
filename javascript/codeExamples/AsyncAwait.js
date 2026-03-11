/**
 *
 */

// async function always return a promise
const p1 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Promise 1 resolved!"), 5000);
});

const p2 = new Promise((resolve, reject) => {
    setTimeout(() => resolve("Promise 2 resolved!"), 5000);
});

async function wait(x) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve(console.log("waiting after ", x));
        }, 5000);
    });
}

console.log("1");
async function handlePromise() {
    // pause the async function execution, not the javascript thread
    // moved out of call stack
    const val1 = await p1;
    console.log("2");
    console.log(val1);

    await wait(val1);

    // pause the async function execution, not the javascript thread
    // moved out of call stack
    const val2 = await p2;
    console.log("3");
    console.log(val2);
}

// await handlePromise();

handlePromise();
//handlePromise will be suspended from callstack fo certain time, then rest of the code will be executed
console.log("4");
