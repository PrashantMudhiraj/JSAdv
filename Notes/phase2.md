## PHASE 2 — `this`, Closures & Prototypes

---

### **15. `this` Keyword — Overview**

#### Concept Overview

The `this` keyword in JavaScript represents the **execution context of a function**, not where the function is written. Its value is determined **at the time the function is called**, which makes `this` one of the most confusing but powerful concepts in the language.

In simple terms, `this` answers the question:

> “Who is calling this function right now?”

#### Key Features / Mechanics

JavaScript does not bind `this` lexically (except in arrow functions). Instead, the engine determines its value dynamically based on **how a function is invoked**. This design allows functions to be reused across multiple objects, but it also introduces ambiguity if the call site is unclear.

#### Code Example

```js
function show() {
    console.log(this);
}

show(); // depends on environment (global / undefined in strict mode)
```

#### Common Gotchas / Best Practices

Many bugs occur because developers assume `this` behaves like variables in lexical scope. Always identify the **call site** before reasoning about `this`.

---

### **16. Default Binding**

#### Concept Overview

Default binding is the **fallback rule** for `this` when no other binding rule applies. When a function is called without an owning object, JavaScript uses the default binding.

#### Key Features / Mechanics

In non-strict mode, default binding points `this` to the **global object** (`window` in browsers, `global` in Node.js). In strict mode, `this` becomes `undefined`, which helps catch errors early.

#### Code Example

```js
"use strict";

function test() {
    console.log(this);
}

test(); // undefined
```

#### Common Gotchas / Best Practices

Relying on default binding is dangerous in production code. Always prefer explicit or implicit binding to avoid accidental global access.

---

### **17. Implicit Binding**

#### Concept Overview

Implicit binding occurs when a function is called **as a property of an object**. In this case, `this` refers to the object **to the left of the dot** at the call site.

#### Key Features / Mechanics

The JavaScript engine looks at the immediate object that owns the function reference during invocation and binds `this` to that object only for that call.

#### Code Example

```js
const user = {
    name: "Prashant",
    greet() {
        console.log(this.name);
    },
};

user.greet(); // Prashant
```

#### Common Gotchas / Best Practices

Implicit binding is lost when the function reference is detached from the object, such as when passing it as a callback.

---

### **18. Explicit Binding**

#### Concept Overview

Explicit binding allows developers to **manually control** the value of `this` using special methods provided by JavaScript.

#### Key Features / Mechanics

JavaScript exposes `call`, `apply`, and `bind` methods on all functions. These methods override default and implicit binding rules by explicitly setting `this`.

---

### **19. `call`**

#### Concept Overview

`call` invokes a function immediately while explicitly setting `this`, passing arguments individually.

#### Code Example

```js
function greet(city) {
    console.log(this.name, city);
}

const user = { name: "Alex" };

greet.call(user, "Hyderabad");
```

#### Best Practices

Use `call` when argument count is known and clarity matters.

---

### **20. `apply`**

#### Concept Overview

`apply` is similar to `call`, but it accepts arguments as an array. It is useful when arguments are already grouped.

#### Code Example

```js
greet.apply(user, ["Bangalore"]);
```

#### Best Practices

Prefer `apply` when working with variadic or dynamic arguments.

---

### **21. `bind`**

#### Concept Overview

`bind` does not execute the function immediately. Instead, it returns a **new function** with `this` permanently bound.

#### Key Features / Mechanics

Once bound, `this` cannot be overridden by other binding rules except `new`.

#### Code Example

```js
const boundGreet = greet.bind(user);
boundGreet("Delhi");
```

#### Common Gotchas

Overusing `bind` can create unnecessary function allocations.

---

### **22. `new` Binding**

#### Concept Overview

When a function is invoked with the `new` keyword, JavaScript creates a **new object** and binds `this` to that object.

#### Key Features / Mechanics

The `new` keyword changes the execution flow by creating a fresh object, linking prototypes, and returning the object implicitly.

#### Code Example

```js
function User(name) {
    this.name = name;
}

const u = new User("Sam");
```

---

### **23. Binding Priority Order**

#### Concept Overview

When multiple binding rules apply, JavaScript follows a strict priority order to resolve `this`.

#### Priority (High → Low)

`new` → `bind` → `call/apply` → implicit → default

Understanding this order is critical for debugging `this` issues.

---

### **24. Closures — What Is a Closure**

#### Concept Overview

A closure is created when a function **remembers variables from its lexical scope**, even after the outer function has finished execution.

Closures are possible because JavaScript functions carry a reference to their **lexical environment**, not just their code.

#### Code Example

```js
function outer() {
    let count = 0;

    return function inner() {
        count++;
        return count;
    };
}

const counter = outer();
counter();
```

---

### **25. Closure Memory Behavior**

#### Concept Overview

Variables captured by closures are stored in the **heap**, not the stack. They remain in memory as long as the closure exists.

This explains why closures can both enable powerful patterns and cause memory leaks if misused.

#### Best Practices

Always release references to closures when they are no longer needed, especially in long-running Node.js processes.

---

### **26. Closure vs Scope**

#### Concept Overview

Scope defines **where variables are accessible**, while closures define **how long variables stay alive**.

A closure is not a new scope; it is a function retaining access to an existing scope beyond its normal lifetime.

---

### **27. Real Production Use-Cases of Closures**

#### Concept Overview

Closures are heavily used in real systems for data encapsulation, state management, memoization, event handlers, and frameworks like React.

They allow private state without exposing it globally or attaching it to objects.

---

### **28. Are Modules Closures?**

#### Concept Overview

Yes, JavaScript modules behave like closures. Each module has its own private scope, and exported values are references preserved by closure semantics.

This is why module-level variables persist across imports.

---

### **29. Prototypes & Inheritance — Overview**

#### Concept Overview

JavaScript uses **prototype-based delegation**, not classical inheritance. Objects delegate property access to other objects via the prototype chain.

This model is more flexible and memory-efficient than class-based inheritance.

---

### **30. Prototype Chain & Delegation Model**

#### Concept Overview

When accessing a property, JavaScript first checks the object itself. If not found, it follows the prototype chain upward until the property is found or `null` is reached.

#### Code Example

```js
const parent = { role: "admin" };
const child = Object.create(parent);

console.log(child.role); // admin
```

#### Common Gotchas / Best Practices

Deep prototype chains can hurt performance and readability. Prefer shallow delegation.
