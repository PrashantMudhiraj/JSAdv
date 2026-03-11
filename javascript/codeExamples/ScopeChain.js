/**
 * Scope : A Scope is where a particular variable can be accessible.
 * Lexical environment is the local scope and Lexical environment of it's parent scope
 */

function a() {
    //function scope
    c();
    function c() {
        console.log(b); // 10
    }
}

var b = 10; //Global scope
a(); // function invocation

/**
 * In above program b and a() is global scope
 * c() is function scope, where it have access to current environment(a scope) and also global scope
 * c - local scope(a())
 * a - Global scope
 */
