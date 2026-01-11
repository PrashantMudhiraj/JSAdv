const cart = ["shoes", "pants", "shorts"];

//callback hell or Pyramid of doom
//Inversion of control : where we loose control over the code.
api.createOrder(cart, function () {
    api.proceedToPayment(function () {
        api.showOrderSummary(function () {
            api.updateWallet(function () {
                return "wallet Updated";
            });
        });
    });
});
