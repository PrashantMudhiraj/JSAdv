const user = {
    _name: "prashant",

    get name() {
        return this._name.toUpperCase();
    },

    set name(value) {
        if (typeof value !== string) {
            throw new TypeError("Name must be a string");
        }
        this._ame = value.trim();
    },
};

console.log(user.name);
