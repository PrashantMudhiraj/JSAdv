## PHASE 1 — JavaScript Fundamentals (Execution & Scope)

---

### **1. JavaScript Execution Model**

#### Concept Overview

JavaScript follows a **single-threaded, synchronous execution model**. This means it can execute **only one piece of code at a time**.
Think of it like a **single cashier at a counter**: tasks are handled one by one. Long tasks block the queue unless deferred.

#### Key Features / Mechanics

- Executes code **line by line**
- Uses a **call stack** to track execution
- Async tasks are delegated to the environment (browser / Node.js)
- Concurrency is achieved via the **event loop**, not threads

#### Code Example

```js
console.log("Start");

setTimeout(() => {
    console.log("Async Task");
}, 0);

console.log("End");
```

> Output:

```
Start
End
Async Task
```

#### Common Gotchas / Best Practices

- JavaScript is **single-threaded**, not single-tasked
- Async does **not** mean parallel execution

---

### **2. Global Execution Context**

#### Concept Overview

The **Global Execution Context (GEC)** is the **first execution context** created when a JS file starts running.

#### Key Features / Mechanics

- Created in two phases:
    1. **Creation Phase**
    2. **Execution Phase**

- Sets up:
    - Global object (`window` / `global`)
    - `this`
    - Variable and function declarations

#### Code Example

```js
var x = 10;

function show() {
    console.log(x);
}

show();
```

#### Common Gotchas / Best Practices

- In **Node.js modules**, `this !== global`
- Avoid global variables in production systems

---

### **3. Call Stack**

#### Concept Overview

The **call stack** keeps track of **which function is currently executing**.
It follows **LIFO (Last In, First Out)**.

#### Key Features / Mechanics

- Function call → pushed onto stack
- Function return → popped off stack
- Stack overflow occurs with deep or infinite recursion

#### Code Example

```js
function first() {
    second();
}

function second() {
    third();
}

function third() {
    console.log("Finished");
}

first();
```

#### Common Gotchas / Best Practices

- Recursive functions must have exit conditions
- Heavy synchronous logic blocks the stack

---

### **4. Hoisting**

#### Concept Overview

Hoisting is JavaScript’s behavior of **moving declarations to the top of their scope** during the creation phase.

#### Key Features / Mechanics

- `var` → hoisted and initialized as `undefined`
- `let` / `const` → hoisted but uninitialized
- Function declarations are fully hoisted

#### Code Example

```js
console.log(a); // undefined
var a = 5;
```

#### Common Gotchas / Best Practices

- Hoisting is about **declarations, not assignments**
- Prefer `let` / `const` to avoid confusion

---

### **5. `var`**

#### Concept Overview

`var` is the **oldest variable declaration** in JavaScript and is **function-scoped**, not block-scoped.

#### Key Features / Mechanics

- Function scope
- Allows redeclaration
- Hoisted with `undefined`

#### Code Example

```js
function test() {
    if (true) {
        var x = 10;
    }
    console.log(x); // 10
}
```

#### Common Gotchas / Best Practices

- ❌ Causes accidental scope leaks
- ✅ Avoid in modern codebases

---

### **6. Function Declarations**

#### Concept Overview

Function declarations are defined using the `function` keyword and are **fully hoisted**.

#### Key Features / Mechanics

- Available before execution
- Stored in memory during creation phase

#### Code Example

```js
greet();

function greet() {
    console.log("Hello");
}
```

#### Common Gotchas / Best Practices

- Function declarations are safer than function expressions for hoisting

---

### **7. `let` / `const`**

#### Concept Overview

Introduced in ES6, `let` and `const` provide **block-scoped variables**.

#### Key Features / Mechanics

- Block scope
- No redeclaration
- `const` prevents reassignment (not mutation)

#### Code Example

```js
let count = 1;
count = 2;

const user = { name: "Alex" };
user.name = "Sam"; // allowed
```

#### Common Gotchas / Best Practices

- Use `const` by default
- Use `let` only when reassignment is needed

---

### **8. Temporal Dead Zone (TDZ)**

#### Concept Overview

TDZ is the time between **entering a scope and variable initialization** where access is illegal.

#### Key Features / Mechanics

- Applies to `let` and `const`
- Prevents usage before declaration

#### Code Example

```js
console.log(a); // ReferenceError
let a = 10;
```

#### Common Gotchas / Best Practices

- TDZ exists to prevent unpredictable behavior
- Declare variables at the top of blocks

---

### **9. Lexical Scope**

#### Concept Overview

Lexical scope means scope is determined by **where variables are written**, not where functions are called.

#### Key Features / Mechanics

- Inner functions can access outer variables
- Scope is fixed at author time

#### Code Example

```js
function outer() {
    const x = 10;

    function inner() {
        console.log(x);
    }

    inner();
}
```

---

### **10. Scope Chain**

#### Concept Overview

When a variable is accessed, JavaScript looks:

1. Local scope
2. Parent scope
3. Global scope

This lookup path is the **scope chain**.

#### Key Features / Mechanics

- Stops at first match
- Ends at global scope

---

### **11. Function Scope vs Block Scope**

#### Concept Overview

Older JavaScript had **function-only scope**. ES6 introduced **block scope**.

#### Key Features / Mechanics

- `var` → function-scoped
- `let` / `const` → block-scoped

#### Code Example

```js
if (true) {
    let a = 1;
    var b = 2;
}

console.log(b); // 2
// console.log(a); // ReferenceError
```

---

### **12. Arrow Functions vs Normal Functions**

#### Concept Overview

Arrow functions are **shorter, lexical, and context-aware**, while normal functions are dynamic.

#### Key Differences

- Arrow functions:
    - No `this`
    - No `arguments`
    - Cannot be constructors

#### Code Example

```js
const arrow = () => {
    console.log(this);
};

function normal() {
    console.log(this);
}
```

---

### **13. Lexical `this`**

#### Concept Overview

Arrow functions **inherit `this` from their surrounding scope**, instead of creating their own.

#### Key Features / Mechanics

- `this` is fixed at definition time
- Cannot be changed using `call`, `apply`, or `bind`

#### Code Example

```js
function Timer() {
    this.seconds = 0;

    setInterval(() => {
        this.seconds++;
    }, 1000);
}
```

---

### **14. Scope Differences (Summary Topic)**

#### Concept Overview

Scope differences define **visibility and lifetime** of variables.

#### Key Features / Mechanics

- Global scope → entire program
- Function scope → inside function
- Block scope → `{}` blocks

#### Best Practices

- Minimize scope size
- Prefer block scope for safety
- Avoid globals in production
