/**
 * Block Scope - The variable that are declared inside a blocked enclosed by curly brackets({}), Only accessible in the block, not outside
 * - If, else, for, while, switch
 * - Group of statements (Compound Statement). We can only write multiple statement in a group
 * - Let and Const are block scope
 * - Var is function scope
 */

var a = "hello 1";
let b = "not overridden";
{
    let a = "hello 1"; //statement -> shadowed by line num 9
    let b = "hello 2"; //statement
    {
        let a = "Hi";
        console.log(a, b); // Hi hello2
    }
} //Block

// if (x == 10) console.log("check"); // for single statement block is not required.
// if (x == 11) {
//   // block
//   console.log(x);
//   console.log("inside block");
// }

{
    var a = 10; // shadowed a = "hello 1"
    let b = 20;
    const c = 30;

    console.log(a);
    console.log(b);
    console.log(c);
}

console.log(a); //10
console.log(b); // not overrided
// console.log(c); //error

// Illegal Shadowing
var a1 = 20; //let a1 = 20
{
    let a1 = 20;
}
