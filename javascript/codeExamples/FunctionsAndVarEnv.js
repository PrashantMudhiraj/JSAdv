var x = 1;
a(); // hoisting
b(); // hoisting

console.log(x); // Global Scope

function a() {
  var x = 10;
  console.log(x); // function scope
  // xarrfn(); // error
}

function b() {
  var x = 100;
  console.log(x); // function scope
}

const xarrfn = () => {
  console.log(x); // scope chain -> picked value from global
};

if (x == 10) {
} // Blocked Scope
xarrfn();

console.log(this.a);
