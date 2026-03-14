const Calculator = (function () {
    let result = 0;
    return {
        add(x) {
            result += x;
            return this;
        },
        sub(x) {
            result -= x;
            return this;
        },
        getResult(x) {
            return result;
        },
        reset(x) {
            result = 0;
            return this;
        },
    };
})();

Calculator.add(10).sub(1);
console.log(Calculator.getResult());
