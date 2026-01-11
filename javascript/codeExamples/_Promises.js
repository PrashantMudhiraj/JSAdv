/**
 * Promise : A promise is an object representing an eventual result of an asynchronous operation and its resulting value
 *  - states: pending, fulfilled , rejected.
 */

const cart = ["shoes", "pants", "shorts", "goggles"];
let orderID = 10000;

const createOrder = (cart) => {
    const promise = new Promise((resolve, reject) => {
        resolve({
            data: `Order Created for cart ${cart}`,
            orderId: ++orderID,
        });
    });
    return promise;
};

const proceedToPayment = (orderId) => {
    return Promise.resolve({
        data: `Payment done for order_id ${orderId}`,
        invoiceNo: new Date().getTime(),
    });
};

//Promising chaining
createOrder("shoes")
    .then((order) => order?.orderId)
    .then((orderId) => proceedToPayment(orderId))
    .then((res) => console.log(res))
    .catch((err) => console.log(err.message));
