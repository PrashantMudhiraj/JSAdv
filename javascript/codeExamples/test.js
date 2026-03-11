function blockingWait() {
    const start = Date.now();

    // Blocks the event loop
    while (Date.now() - start < 10000) {}

    console.log("Blocking task finished");
}

async function asyncWait() {
    // Suspends only this function
    await new Promise((resolve) => setTimeout(resolve, 5000));
    console.log("Async task finished");
}

console.log("Start");

setTimeout(() => {
    console.log("Timeout executed");
}, 0);

// blockingWait(); // blocks everything

asyncWait();

console.log("End");
