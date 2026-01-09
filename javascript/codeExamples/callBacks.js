/**
 * CallBack Function : It is a function passed into another function as an argument, which is then invoked inside the outer function to complete some kind of action
 */

function x(y) {
  console.log("x");
  y();
}

x(function y() {
  console.log("y");
});

//------------
