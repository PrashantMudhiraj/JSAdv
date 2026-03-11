/**
Execution context 
- Everything in JavaScript happens inside an Execution context
- A place where JavaScript code is executed
- It has 2 main components
    - Memory (variable environment) - Heap
        - It contains variable name and function declarations
    - Code (Thread of Execution) / code components - Stack
        - A place where our code is executed
 */

var n = 2;

function square(num) {
    var ans = num * num;
    return ans;
}

var square2 = square(n);
var square4 = square(4);

console.log(square2, square4);

/**
 * PHASE 1 : Memory creation phase
 * A Execution Context is created
 * n variable created  in memory and assign undefined value
 * fn square will be stored in memory and assign function block to it -> square : fn {}
 * square2 variable created  in memory and assigned with undefined value
 * square4 variable created  in memory and assigned with undefined value
 *
 * PHASE 2 : Code execution phase
 * 2 value is assigned to variable n
 * when we invoke a function a brand new execution context is created(square2)
 *      - For square2 a new execution context is created which have their own memory and code component
 *          - PHASE 1 : Memory creation phase
 *          - num variable is created in memory and assigned with undefined value
 *          - ans variable is created in memory and assigned with undefined value
 *          - PHASE 2 : Code execution phase
 *          - resolve / calculate -> num * num
 *          - assign result to num * num to ans
 *          - return ans -> Control given back to main execution context and delete current execution context (pop() - current function execution context)
 *
 * At the end Global Execution context will be deleted/popped out of stack (once task is done)
 *
 * 1.Global Execution Context(complete program)- created
 * 2.Global Execution Context(complete program) <-----> function execution context(functional block) (square2) (created)
 * 3.Control back to GEC , FEC will be deleted(popped out of stack)
 * 4.Global Execution Context(complete program) <-----> function execution context(functional block) (square4) (created)
 * 5.Control back to GEC , FEC will be deleted(popped out of stack)
 * 6.Global Execution Context(complete program) - deleted(popped out of stack)
 *
 *
 *
 *  CALL STACK will maintain order of the execution context of the execution context's
 *  Call stack also called as
 *  - Execution Context stack
 *  - Program Stack
 *  - Control Stack
 *  - Runtime Stack
 *  - Machine Stack
 */
