function x() {
  //   var i = 1;
  for (var i = 0; i < 5; i++) {
    // setTimeout(function () {
    //   console.log(i);
    // }, 1000 * i); // this function forms a closure
    ((i) => {
      setTimeout(function () {
        console.log(i);
      }, 1000 * i);
    })(i);
  }
  console.log("Hey I'm here, Catch me if you can!"); // this will execute asap, not wait for setTimeout
}

x();
